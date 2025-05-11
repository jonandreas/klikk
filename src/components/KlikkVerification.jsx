"use client";

import { useState, useRef, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Loader2, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { verifyCode, sendVerificationSMS, maskPhoneNumber } from "@/lib/twilio-service";
import { useToast } from "@/components/ui/toast";

export default function KlikkVerification({ userData, onSuccess }) {
  const { addToast } = useToast();
  const [code, setCode] = useState(Array(6).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);

  // Focus on first input when component mounts
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Automatically submit when all digits are entered
  useEffect(() => {
    const enteredCode = code.join('');
    if (enteredCode.length === 6 && !isVerifying && !isSuccess) {
      handleVerify();
    }
  }, [code]);

  // Handle code input
  const handleCodeChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    // Only take the last character if pasting multiple digits
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Move to next input if this one is filled
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle key navigation between inputs
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      // Move left
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      // Move right
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle verification with Twilio service
  const handleVerify = async () => {
    const enteredCode = code.join('');
    if (enteredCode.length !== 6 || !userData || !userData.mobile) return;

    setIsVerifying(true);
    setIsError(false);
    
    try {
      // Call verification service
      const result = await verifyCode(userData.mobile, enteredCode);
      
      if (result.success) {
        setIsSuccess(true);
        addToast('Verification successful!', 'success');
        
        // After success animation, call onSuccess
        setTimeout(() => {
          onSuccess();
        }, 1200);
      } else {
        setIsError(true);
        setErrorMessage(result.message || 'Invalid verification code');
        
        // Show error toast
        addToast(
          result.message || 'Invalid verification code', 
          'error'
        );
        
        // Update remaining attempts if available
        if (result.remainingAttempts !== undefined) {
          setRemainingAttempts(result.remainingAttempts);
        }
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      setIsError(true);
      setErrorMessage('Something went wrong. Please try again.');
      addToast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle paste functionality
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');

    // Filter only numbers and limit to 6 digits
    const validDigits = pastedData.replace(/\D/g, '').slice(0, 6);

    // If we have valid digits, fill the inputs
    if (validDigits) {
      const newCode = Array(6).fill('');
      for (let i = 0; i < validDigits.length; i++) {
        newCode[i] = validDigits[i];
      }
      setCode(newCode);

      // Focus on the next empty input or the last one
      const nextIndex = Math.min(validDigits.length, 5);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }
    }
  };

  // Handle resending SMS code
  const handleResendCode = async () => {
    if (!userData || !userData.mobile || isResending) return;
    
    setIsResending(true);
    setIsError(false);
    
    try {
      const result = await sendVerificationSMS(userData.mobile);
      
      if (result.success) {
        addToast('Verification code resent!', 'success');
        
        // In development, show code for testing if available
        if (process.env.NODE_ENV === 'development' && result.code) {
          console.log('DEV CODE:', result.code);
          addToast(`DEV CODE: ${result.code}`, 'info', 10000);
        }
      } else {
        setIsError(true);
        setErrorMessage('Failed to resend verification code.');
        addToast('Failed to resend verification code', 'error');
      }
    } catch (error) {
      console.error('Error resending verification code:', error);
      setIsError(true);
      setErrorMessage('Something went wrong. Please try again.');
      addToast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center" >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center mb-4" >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }} >
          <Smartphone className="h-6 w-6" />
        </motion.div>
      </motion.div>

      <motion.h3
        className="text-xl font-medium mb-1 text-center"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Verify Your Identity
      </motion.h3>

      <motion.p
        className="text-gray-500 mb-2 text-center"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Enter the 6-digit code sent to
      </motion.p>
      
      <motion.p
        className="font-medium mb-6 text-center"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        {userData && userData.mobile ? maskPhoneNumber(userData.mobile) : ''}
      </motion.p>

      <motion.div
        className="flex justify-center gap-2 mb-6"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {code.map((digit, index) => (
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              y: 20,
              rotateY: 80
            }}
            animate={{
              opacity: 1,
              y: 0,
              rotateY: 0
            }}
            transition={{
              delay: 0.4 + (index * 0.06),
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
          >
            <Input
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              autoComplete={index === 0 ? "one-time-code" : "off"}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={`w-10 h-14 text-center text-lg font-medium ${
                isError ? 'border-red-500 bg-red-50' :
                digit ? 'border-indigo-500 bg-indigo-50' : ''
              } focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition-all duration-150`}
            />
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {isError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center text-red-600 mb-4"
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">
              {errorMessage}
              {remainingAttempts > 0 && ` (${remainingAttempts} attempts left)`}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-xs"
      >
        <Button
          className="w-full relative"
          onClick={handleVerify}
          disabled={code.join('').length !== 6 || isVerifying || isSuccess}
        >
          <AnimatePresence mode="wait">
            {isVerifying ? (
              <motion.div
                key="verifying"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </motion.div>
            ) : isSuccess ? (
              <motion.div
                key="success"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Verified!
              </motion.div>
            ) : (
              <motion.span key="verify">
                Verify & Continue
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-6 text-sm text-gray-500"
      >
        Didn't receive a code?{' '}
        <button 
          type="button"
          onClick={handleResendCode}
          disabled={isResending}
          className="text-indigo-600 font-medium disabled:opacity-50"
        >
          {isResending ? 'Sending...' : 'Resend'}
        </button>
      </motion.p>
    </motion.div>
  );
}