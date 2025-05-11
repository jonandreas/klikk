// Server-side Twilio client setup

import twilio from 'twilio';

// Initialize the Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

// Create a function to get the Twilio client to avoid initialization on client-side
export const getTwilioClient = () => {
  // Check if environment variables are set
  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials are not properly configured.');
  }
  
  return twilio(accountSid, authToken);
};

export const getMessagingServiceSid = () => {
  if (!messagingServiceSid) {
    throw new Error('Twilio Messaging Service SID is not configured.');
  }
  
  return messagingServiceSid;
};

// This would be used only on the server side
// No sensitive information is exposed to the client