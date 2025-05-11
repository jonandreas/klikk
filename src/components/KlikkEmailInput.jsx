"use client";

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, CheckCircle, Smartphone, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sendVerificationSMS } from "@/lib/twilio-service";
import { formatPhoneNumber, maskPhoneNumber } from "@/lib/twilio-service";
import { useToast } from "@/components/ui/toast";

export default function KlikkEmailInput({ onSubmit, testUsers }) {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [isKlikkUser, setIsKlikkUser] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [isSendingSMS, setIsSendingSMS] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [smsError, setSmsError] = useState(null);

  // Validate email format
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));

    // Reset states when email changes
    if (isKlikkUser) {
      setIsKlikkUser(false);
      setMatchedUser(null);
      setSmsSent(false);
      setSmsError(null);
    }

  }, [email]);

  const handleEmailBlur = () => {
    if (!isValidEmail || email.length === 0) return;

    // Check for Klikk user in database
    setIsValidating(true);

    setTimeout(() => {
      const matchedUser = testUsers.find(user =>
        user.email.toLowerCase() === email.toLowerCase()
      );

      setIsValidating(false);

      if (matchedUser) {
        // Trigger pulse animation
        setIsPulsing(true);

        // After pulse animation, show Klikk option
        setTimeout(() => {
          setIsKlikkUser(true);
          setMatchedUser(matchedUser);
          
          // Notify user they've been recognized
          addToast(`Welcome back, ${matchedUser.name}!`, 'info', 3000);
        }, 600);
      }
    }, 800); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValidEmail) {
      onSubmit(email, isKlikkUser, matchedUser);
    }
  };

  const handleKlikkContinue = async () => {
    // Send SMS verification code and proceed
    if (!matchedUser || !matchedUser.mobile) {
      addToast('No mobile number found for this account', 'error');
      return;
    }

    setIsSendingSMS(true);
    setSmsError(null);
    
    try {
      const result = await sendVerificationSMS(matchedUser.mobile);
      
      if (result.success) {
        setSmsSent(true);
        
        // Show success toast
        addToast(`Verification code sent to ${maskPhoneNumber(matchedUser.mobile)}`, 'success');
        
        // After a short delay, proceed to verification screen
        setTimeout(() => {
          onSubmit(email, true, matchedUser);
        }, 1000);
      } else {
        setSmsError(result.message || 'Failed to send verification code');
        addToast(result.message || 'Failed to send verification code', 'error');
        
        // In development, show code for testing if available
        if (process.env.NODE_ENV === 'development' && result.code) {
          console.log('DEV CODE:', result.code);
          addToast(`DEV CODE: ${result.code}`, 'info', 10000);
        }
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
      setSmsError('An unexpected error occurred');
      addToast('An unexpected error occurred', 'error');
    } finally {
      setIsSendingSMS(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleEmailBlur}
            placeholder="you@example.com"
            className={`transition-all duration-300 ${
              isPulsing ? 'shadow-[0_0_20px_rgba(79,70,229,0.5)] border-indigo-500' : ''
            } ${isKlikkUser ? 'border-indigo-500 bg-indigo-50' : ''}`}
          />

          {isValidating && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          )}

          {isKlikkUser && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <Badge className="bg-indigo-600 hover:bg-indigo-700">
                  <span className="flex items-center">
                    <Sparkles className="h-3 w-3 mr-1" /> Klikk User
                  </span>
                </Badge>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isKlikkUser && matchedUser && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <Card className="border-indigo-200 shadow-md bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <motion.div
                    initial={{ rotate: -10, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.1
                    }}
                    className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 p-2"
                  >
                    <Sparkles className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <motion.p
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="font-medium text-indigo-900"
                    >
                      Welcome back, {matchedUser.name}!
                    </motion.p>
                    <motion.p
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-sm text-indigo-700"
                    >
                      Complete checkout in seconds with Klikk
                    </motion.p>
                  </div>
                </div>

                {/* Show phone number info */}
                <motion.div
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center mb-4 bg-white bg-opacity-60 p-2 rounded border border-indigo-100"
                >
                  <Smartphone className="h-4 w-4 text-indigo-500 mr-2" />
                  <div className="text-sm">
                    <span className="text-gray-600">Verification code will be sent to </span>
                    <span className="font-medium">{maskPhoneNumber(matchedUser.mobile)}</span>
                  </div>
                </motion.div>

                {/* Error message */}
                {smsError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center mb-4 bg-red-50 p-2 rounded border border-red-100 text-red-600"
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">{smsError}</span>
                  </motion.div>
                )}

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    type="button"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white relative"
                    onClick={handleKlikkContinue}
                    disabled={isSendingSMS || smsSent}
                  >
                    {isSendingSMS ? (
                      <span className="flex items-center">
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Sending verification code...
                      </span>
                    ) : smsSent ? (
                      <span className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verification code sent
                      </span>
                    ) : (
                      <>
                        <span className="mr-2">Continue with Klikk</span>
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white bg-opacity-30">
                          →
                        </span>
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        variant={isKlikkUser ? "outline" : "default"}
        className="w-full"
        disabled={!isValidEmail}
      >
        {isKlikkUser ? "Continue with Regular Checkout" : "Continue"}
      </Button>
    </form>
  );
}