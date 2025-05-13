import { NextResponse } from 'next/server';
import { getTwilioClient, getMessagingServiceSid } from '@/lib/twilio-client';
import { getServiceSupabase } from '@/lib/supabase-client';
import { verificationCodes } from '@/lib/test-data';

// Generate a random 6-digit code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function POST(request) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Generate a new verification code
    const code = generateVerificationCode();

    try {
      // Initialize Twilio client
      const client = getTwilioClient();
      const messagingServiceSid = getMessagingServiceSid();

      // Format the message for iOS auto-fill detection
      // Using the format: <#> Your verification code is: 123456
      // Additional text about expiration can come after this
      // The app's domain should be included at the end for enhanced auto-fill
      const appDomain = process.env.NEXT_PUBLIC_APP_URL || 'klinkur.is';
      const messageBody = `<#> Your Klikk verification code is: ${code}. This code will expire in 10 minutes. ${appDomain}`;

      // Send SMS using Twilio with Messaging Service
      await client.messages.create({
        body: messageBody,
        messagingServiceSid: messagingServiceSid,
        to: phoneNumber
      });

      // Store verification code in Supabase if database is set up and we're not in local development mode
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.USE_LOCAL_DEVELOPMENT !== 'true') {
        await storeVerificationCodeInSupabase(phoneNumber, code);
      } else {
        // Fallback to in-memory storage
        verificationCodes.set(phoneNumber, {
          code,
          createdAt: new Date(),
          attempts: 0,
        });
      }

      return NextResponse.json({
        success: true,
        message: `Verification code sent to ${phoneNumber}`
      });

    } catch (twilioError) {
      console.error('Twilio error:', twilioError);

      // For development/demo purposes, still store the code even if Twilio fails
      // This allows testing without actual SMS delivery
      if (process.env.NODE_ENV === 'development') {
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.USE_LOCAL_DEVELOPMENT !== 'true') {
          await storeVerificationCodeInSupabase(phoneNumber, code);
        } else {
          // Fallback to in-memory storage
          verificationCodes.set(phoneNumber, {
            code,
            createdAt: new Date(),
            attempts: 0,
          });
        }

        console.log(`[DEV MODE] Code for ${phoneNumber}: ${code}`);

        return NextResponse.json({
          success: true,
          message: `Development mode: Code is ${code}`,
          code: code // Only included in development mode
        });
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send SMS',
          details: twilioError.message
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error sending verification code:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Store verification code in Supabase database
 */
async function storeVerificationCodeInSupabase(phoneNumber, code) {
  try {
    const supabase = getServiceSupabase();

    // Calculate expiration time (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // First invalidate any existing codes for this phone number
    await supabase
      .from('verification_codes')
      .update({ verified: true })
      .eq('phone', phoneNumber)
      .eq('verified', false);

    // Insert new verification code
    const { error } = await supabase
      .from('verification_codes')
      .insert({
        phone: phoneNumber,
        code: code,
        expires_at: expiresAt.toISOString(),
        attempts: 0,
        verified: false
      });

    if (error) {
      console.error('Error storing verification code in Supabase:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in storeVerificationCodeInSupabase:', error);
    return false;
  }
}