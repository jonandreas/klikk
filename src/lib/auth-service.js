/**
 * Authentication service using Supabase Auth
 */
import { supabase, getServiceSupabase } from './supabase-client';

/**
 * Sign in with email
 * This will send a magic link to the provided email
 */
export const signInWithEmail = async (email) => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    
    return {
      success: true,
      message: `Magic link sent to ${email}`,
    };
  } catch (error) {
    console.error('Error signing in with email:', error);
    return {
      success: false,
      message: error.message || 'Error sending magic link',
    };
  }
};

/**
 * Sign in with phone
 * This will send an OTP to the provided phone number
 */
export const signInWithPhone = async (phone) => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) throw error;
    
    return {
      success: true,
      message: `Verification code sent to ${phone}`,
    };
  } catch (error) {
    console.error('Error signing in with phone:', error);
    return {
      success: false,
      message: error.message || 'Error sending verification code',
    };
  }
};

/**
 * Verify a phone number OTP
 */
export const verifyPhoneOtp = async (phone, token) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });

    if (error) throw error;
    
    // Ensure the user exists in our users table
    await ensureUserExists();
    
    return {
      success: true,
      user: data.user,
      session: data.session,
    };
  } catch (error) {
    console.error('Error verifying phone OTP:', error);
    return {
      success: false,
      message: error.message || 'Invalid verification code',
    };
  }
};

/**
 * Custom verification with our Twilio integration
 * This links to our existing SMS verification system
 */
export const customPhoneVerification = async (phone, code) => {
  try {
    // First verify with our custom verification API
    const verifyResponse = await fetch('/api/sms/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber: phone, code }),
    });
    
    const verifyResult = await verifyResponse.json();
    
    if (!verifyResult.success) {
      return {
        success: false,
        message: verifyResult.message || 'Invalid verification code',
        remainingAttempts: verifyResult.remainingAttempts,
      };
    }
    
    // If successful, create or sign in the user with Supabase
    // Using the service role to create a user based on phone verification
    const serviceSupabase = getServiceSupabase();
    
    // Check if user exists
    const { data: existingUser } = await serviceSupabase.auth.admin.getUserByPhone(phone);
    
    let authUser;
    
    if (!existingUser) {
      // Create a new user if they don't exist
      const { data: newUser, error: createError } = await serviceSupabase.auth.admin.createUser({
        phone,
        phone_confirm: true, // Mark as confirmed since we verified with our system
        user_metadata: {
          verified_at: new Date().toISOString(),
        },
      });
      
      if (createError) throw createError;
      authUser = newUser.user;
    } else {
      authUser = existingUser.user;
    }
    
    // Create a session for the user
    const { data: session, error: sessionError } = await serviceSupabase.auth.admin.createSession({
      userId: authUser.id,
    });
    
    if (sessionError) throw sessionError;
    
    // Set the session in the client
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
    
    // Ensure the user exists in our users table
    await ensureUserExists();
    
    return {
      success: true,
      user: authUser,
      session: session,
    };
  } catch (error) {
    console.error('Error in custom phone verification:', error);
    return {
      success: false,
      message: error.message || 'Verification failed',
    };
  }
};

/**
 * Get the current user
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    if (!user) {
      return { user: null };
    }
    
    // Get extended user data from our users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single();
    
    if (userError && userError.code !== 'PGRST116') { // Not found is expected
      console.error('Error fetching user data:', userError);
    }
    
    // Only fetch payment methods if we have user data
    let paymentMethods = [];
    if (userData) {
      const { data: paymentData, error: paymentError } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', userData.id)
        .order('is_default', { ascending: false });
      
      if (!paymentError) {
        paymentMethods = paymentData;
      }
    }
    
    return {
      user,
      userData,
      paymentMethods,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { user: null, error: error.message };
  }
};

/**
 * Ensure the user exists in our users table
 * Creates a new user record if one doesn't exist
 */
export const ensureUserExists = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) return null;
    
    // Check if user exists in our users table
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .maybeSingle();
    
    if (userError && userError.code !== 'PGRST116') { // PGRST116 is "Not found" which is expected
      console.error('Error checking existing user:', userError);
      return null;
    }
    
    // If user exists, return it
    if (existingUser) {
      return existingUser;
    }
    
    // Otherwise, create a new user
    // Extract information from the auth user
    const email = user.email;
    const phone = user.phone;
    
    // Create a new user record
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        auth_id: user.id,
        email: email,
        phone: phone,
      })
      .select()
      .single();
    
    if (createError) {
      console.error('Error creating user record:', createError);
      return null;
    }
    
    return newUser;
  } catch (error) {
    console.error('Error ensuring user exists:', error);
    return null;
  }
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return {
      success: false,
      message: error.message || 'Error signing out',
    };
  }
};