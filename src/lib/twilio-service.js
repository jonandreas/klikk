// Client-side service for interacting with Twilio API endpoints

// Send verification SMS via API
export const sendVerificationSMS = async (phoneNumber) => {
  try {
    const response = await fetch('/api/sms/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error response from SMS API:', data);
      return {
        success: false,
        message: data.error || 'Failed to send verification code',
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error sending verification SMS:', error);
    return {
      success: false,
      message: 'Failed to send verification code. Please try again.',
    };
  }
};

// Verify the code entered by the user
export const verifyCode = async (phoneNumber, code) => {
  try {
    const response = await fetch('/api/sms/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, code }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error response from verification API:', data);
      return {
        success: false,
        message: data.error || 'Invalid verification code',
        remainingAttempts: data.remainingAttempts,
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error verifying code:', error);
    return {
      success: false,
      message: 'Error verifying code. Please try again.',
    };
  }
};

// Format phone number for display (e.g., +3546478001 -> +354 647 8001)
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Simple formatting for Icelandic numbers
  if (phoneNumber.startsWith('+354')) {
    return phoneNumber.replace(/(\+354)(\d{3})(\d{4})/, '$1 $2 $3');
  }
  
  return phoneNumber;
};

// Mask phone number for display (e.g., +3546478001 -> +354 *** 8001)
export const maskPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Simple masking for Icelandic numbers
  if (phoneNumber.startsWith('+354')) {
    return phoneNumber.replace(/(\+354)(\d{3})(\d{4})/, '$1 *** $3');
  }
  
  return phoneNumber;
};