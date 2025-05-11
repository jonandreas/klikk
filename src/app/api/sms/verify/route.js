import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase-client';
import { verificationCodes } from '@/lib/test-data'; // Keep for fallback

export async function POST(request) {
  try {
    const { phoneNumber, code } = await request.json();

    if (!phoneNumber || !code) {
      return NextResponse.json(
        { success: false, error: 'Phone number and code are required' },
        { status: 400 }
      );
    }

    // Fallback to in-memory verification in development if database isn't set up or local development mode is enabled
    if (process.env.NODE_ENV === 'development' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.USE_LOCAL_DEVELOPMENT === 'true')) {
      return handleFallbackVerification(phoneNumber, code);
    }

    // Get service client
    const supabase = getServiceSupabase();

    // Query the verification code from Supabase
    const { data: verificationData, error: fetchError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('phone', phoneNumber)
      .eq('verified', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !verificationData) {
      return NextResponse.json(
        {
          success: false,
          error: 'No verification code found',
          remainingAttempts: 0
        },
        { status: 404 }
      );
    }

    // Check if the code is expired
    const now = new Date();
    const expiresAt = new Date(verificationData.expires_at);

    if (now > expiresAt) {
      return NextResponse.json(
        {
          success: false,
          error: 'Verification code has expired',
          remainingAttempts: 0
        },
        { status: 400 }
      );
    }

    // Check attempt limit (usually 3)
    const maxAttempts = 3;
    if (verificationData.attempts >= maxAttempts) {
      return NextResponse.json(
        {
          success: false,
          error: 'Maximum verification attempts exceeded',
          remainingAttempts: 0
        },
        { status: 400 }
      );
    }

    // Increment attempts
    const { error: updateError } = await supabase
      .from('verification_codes')
      .update({ attempts: verificationData.attempts + 1 })
      .eq('id', verificationData.id);

    if (updateError) {
      console.error('Error updating verification attempts:', updateError);
    }

    // Check if the code matches
    if (verificationData.code !== code) {
      const remainingAttempts = maxAttempts - (verificationData.attempts + 1);

      return NextResponse.json(
        {
          success: false,
          error: 'Invalid verification code',
          remainingAttempts: remainingAttempts >= 0 ? remainingAttempts : 0
        },
        { status: 400 }
      );
    }

    // Mark the code as verified
    const { error: verifyError } = await supabase
      .from('verification_codes')
      .update({ verified: true })
      .eq('id', verificationData.id);

    if (verifyError) {
      console.error('Error marking code as verified:', verifyError);
    }

    return NextResponse.json({
      success: true,
      message: 'Phone number verified successfully'
    });
  } catch (error) {
    console.error('Error verifying code:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Fallback verification using in-memory Map for development
function handleFallbackVerification(phoneNumber, code) {
  // Get stored verification data
  const storedData = verificationCodes.get(phoneNumber);

  // Check if there's a verification code for this number
  if (!storedData) {
    return NextResponse.json(
      { success: false, error: 'No verification code found for this number' },
      { status: 404 }
    );
  }

  // Update attempts
  storedData.attempts += 1;
  verificationCodes.set(phoneNumber, storedData);

  // Check if code is correct
  if (storedData.code === code) {
    // Clean up the code from memory
    verificationCodes.delete(phoneNumber);

    return NextResponse.json({
      success: true,
      message: 'Code verified successfully'
    });
  } else {
    // Calculate remaining attempts (max 3)
    const remainingAttempts = Math.max(0, 3 - storedData.attempts);

    // If no attempts left, delete the code
    if (remainingAttempts === 0) {
      verificationCodes.delete(phoneNumber);
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid verification code',
        remainingAttempts
      },
      { status: 400 }
    );
  }
}