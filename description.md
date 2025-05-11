// File structure overview:
//
// /app
// /page.js - Product page
// /checkout/page.js - Checkout page
// /confirmation/page.js - Confirmation page
// /components
// /ui - shadcn components
// /KlikkEmailInput.jsx - Email input with recognition
// /KlikkVerification.jsx - Verification code input
// /KlikkPayment.jsx - Payment confirmation
// /ProductCard.jsx - Sample product component
// /CheckoutSummary.jsx - Order summary component
// /lib
// /test-data.js - Sample data including test users
// /utils.js - Utility functions

// --- FILE: /app/page.js ---

"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";

export default function Home() {
const router = useRouter();
const [isAdded, setIsAdded] = useState(false);

const handleAddToCart = () => {
setIsAdded(true);
setTimeout(() => {
setIsAdded(false);
}, 1500);
};

const goToCheckout = () => {
router.push('/checkout');
};

return (
<div className="container mx-auto py-10">
<h1 className="text-3xl font-bold mb-10 text-center">Klikk Demo Shop</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="overflow-hidden">
          <div className="h-64 bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
            <div className="text-6xl">👕</div>
          </div>
          <CardHeader>
            <CardTitle>Premium Cotton T-Shirt</CardTitle>
            <CardDescription>High-quality, sustainable cotton</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">$29.99</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-black"></div>
                <div className="w-6 h-6 rounded-full bg-blue-600"></div>
                <div className="w-6 h-6 rounded-full bg-green-600"></div>
              </div>
            </div>
            <p className="mt-4 text-gray-600">This premium t-shirt is made from 100% organic cotton, providing exceptional comfort and durability for everyday wear.</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant={isAdded ? "success" : "outline"}
              onClick={handleAddToCart}
              className={isAdded ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {isAdded ? "Added to Cart ✓" : "Add to Cart"}
            </Button>
            <Button onClick={goToCheckout}>Buy Now</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Cart</CardTitle>
            <CardDescription>1 item in your cart</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4 pb-4 border-b">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded flex items-center justify-center">
                  <div className="text-xl">👕</div>
                </div>
                <div>
                  <p className="font-medium">Premium Cotton T-Shirt</p>
                  <p className="text-sm text-gray-500">Black | Size: M</p>
                </div>
              </div>
              <p className="font-medium">$29.99</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>$29.99</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>$4.99</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Total</span>
                <span>$34.98</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              size="lg"
              onClick={goToCheckout}
            >
              Proceed to Checkout
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-20 text-center text-gray-500 text-sm">
        <p>This is a demo store to showcase Klikk - The frictionless checkout experience</p>
      </div>
    </div>

);
}

// --- FILE: /app/checkout/page.js ---

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KlikkEmailInput from '@/components/KlikkEmailInput';
import KlikkVerification from '@/components/KlikkVerification';
import KlikkPayment from '@/components/KlikkPayment';
import CheckoutSummary from '@/components/CheckoutSummary';
import { testUsers } from '@/lib/test-data';
import { motion } from "framer-motion";

export default function Checkout() {
const router = useRouter();
const [email, setEmail] = useState('');
const [step, setStep] = useState('email');
const [isKlikkUser, setIsKlikkUser] = useState(false);
const [userData, setUserData] = useState(null);

const handleEmailSubmit = (email, isKlikk, userData) => {
setEmail(email);
setIsKlikkUser(isKlikk);
if (isKlikk) {
setUserData(userData);
setStep('verify');
} else {
// In a real app, would proceed to normal checkout
// For demo, we'll just go to the regular payment
setStep('regular-payment');
}
};

const handleVerificationSuccess = () => {
setStep('payment');
};

const handlePaymentComplete = () => {
router.push('/confirmation');
};

return (
<div className="container mx-auto py-10 max-w-6xl">
<div className="text-center mb-8">
<h1 className="text-3xl font-bold">Checkout</h1>
<p className="text-gray-500 mt-2">Complete your purchase securely</p>
</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>We'll use this to send your order confirmation</CardDescription>
            </CardHeader>
            <CardContent>
              {step === 'email' && (
                <KlikkEmailInput
                  onSubmit={handleEmailSubmit}
                  testUsers={testUsers}
                />
              )}

              {step === 'verify' && userData && (
                <KlikkVerification
                  email={email}
                  onSuccess={handleVerificationSuccess}
                />
              )}

              {step === 'payment' && userData && (
                <KlikkPayment
                  userData={userData}
                  onComplete={handlePaymentComplete}
                />
              )}

              {step === 'regular-payment' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">Continue with standard checkout...</p>
                  {/* Regular checkout fields would go here */}
                  <Button
                    onClick={handlePaymentComplete}
                    className="w-full mt-4"
                  >
                    Complete Order
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bottom section with additional info */}
          {step === 'email' && (
            <Card>
              <CardHeader>
                <CardTitle>Why use Klikk?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-xl mb-2">⚡</div>
                    <h3 className="font-medium mb-1">Lightning Fast</h3>
                    <p className="text-sm text-gray-600">Checkout in seconds, not minutes</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-xl mb-2">🔒</div>
                    <h3 className="font-medium mb-1">Completely Secure</h3>
                    <p className="text-sm text-gray-600">Your payment details are never shared</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-xl mb-2">📱</div>
                    <h3 className="font-medium mb-1">Works Everywhere</h3>
                    <p className="text-sm text-gray-600">Use on thousands of stores</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <CheckoutSummary />
        </div>
      </div>
    </div>

);
}

// --- FILE: /app/confirmation/page.js ---

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Confirmation() {
// Generate a random order number
const orderNumber = `KLK-${Math.floor(10000 + Math.random() * 90000)}`;

return (
<div className="container mx-auto py-10 max-w-2xl">
<motion.div
initial={{ scale: 0.9, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ duration: 0.5 }} >
<Card className="text-center">
<CardHeader>
<div className="mx-auto mb-4">
<CheckCircle className="h-16 w-16 text-green-500" />
</div>
<CardTitle className="text-2xl">Order Confirmed!</CardTitle>
<CardDescription>Your order has been placed successfully</CardDescription>
</CardHeader>
<CardContent>
<div className="space-y-6">
<div>
<p className="text-gray-500 mb-1">Order Number</p>
<p className="font-medium text-lg">{orderNumber}</p>
</div>

              <div className="border-t border-b py-4 px-6 bg-gray-50 rounded">
                <div className="flex justify-between mb-2">
                  <span>Premium Cotton T-Shirt (Black, M)</span>
                  <span>$29.99</span>
                </div>
                <div className="flex justify-between mb-2 text-gray-500">
                  <span>Shipping</span>
                  <span>$4.99</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>$34.98</span>
                </div>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="bg-indigo-100 rounded-full p-2 mr-3">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="font-medium text-indigo-900">Purchased with Klikk</div>
                </div>
                <p className="text-sm text-indigo-700 pl-10">
                  Your receipt and invoice have been automatically saved to your Klikk account.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <Link href="/">
              <Button variant="outline">Back to Shop</Button>
            </Link>
            <Button>View Order Details</Button>
          </CardFooter>
        </Card>
      </motion.div>

      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">Thank you for trying the Klikk demo!</p>
      </div>
    </div>

);
}

// --- FILE: /components/KlikkEmailInput.jsx ---

"use client";

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function KlikkEmailInput({ onSubmit, testUsers }) {
const [email, setEmail] = useState('');
const [isValidEmail, setIsValidEmail] = useState(false);
const [isValidating, setIsValidating] = useState(false);
const [isPulsing, setIsPulsing] = useState(false);
const [isKlikkUser, setIsKlikkUser] = useState(false);
const [matchedUser, setMatchedUser] = useState(null);

// Validate email format
useEffect(() => {
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
setIsValidEmail(emailRegex.test(email));

    // Reset states when email changes
    if (isKlikkUser) {
      setIsKlikkUser(false);
      setMatchedUser(null);
    }

}, [email]);

const handleEmailBlur = () => {
if (!isValidEmail || email.length === 0) return;

    // Simulate API check for Klikk user
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
        }, 600);
      }
    }, 800); // Simulate network delay

};

const handleSubmit = (e) => {
e.preventDefault();
if (isValidEmail) {
onSubmit(email, isKlikkUser, matchedUser);
}
};

const handleKlikkContinue = () => {
onSubmit(email, true, matchedUser);
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

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    type="button"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                    onClick={handleKlikkContinue}
                  >
                    <span className="mr-2">Continue with Klikk</span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white bg-opacity-30">
                      →
                    </span>
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

// --- FILE: /components/KlikkVerification.jsx ---

"use client";

import { useState, useRef, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function KlikkVerification({ email, onSuccess }) {
const [code, setCode] = useState(Array(6).fill(''));
const [isVerifying, setIsVerifying] = useState(false);
const [isError, setIsError] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const inputRefs = useRef([]);

// Handle code input
const handleCodeChange = (index, value) => {
// Only allow numbers
if (!/^\d\*$/.test(value)) return;

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

// Handle verification
const handleVerify = () => {
const enteredCode = code.join('');
if (enteredCode.length !== 6) return;

    setIsVerifying(true);
    setIsError(false);

    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false);

      // For demo, accept any 6-digit code
      // In production, would verify against a backend
      if (enteredCode.length === 6) {
        setIsSuccess(true);
        // After success animation, call onSuccess
        setTimeout(() => {
          onSuccess();
        }, 1200);
      } else {
        setIsError(true);
      }
    }, 1500);

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
<motion.svg
xmlns="http://www.w3.org/2000/svg"
width="24"
height="24"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
strokeWidth="2"
strokeLinecap="round"
strokeLinejoin="round"
initial={{ scale: 0.5, opacity: 0 }}
animate={{ scale: 1, opacity: 1, rotate: [0, 10, 0] }}
transition={{ delay: 0.4, duration: 0.5, type: "spring" }} >
<rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
<path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
</motion.svg>
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
        className="text-gray-500 mb-6 text-center"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        We sent a 6-digit code to {email}
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
            <span className="text-sm">Invalid code. Please try again.</span>
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
        Didn't receive a code? <button className="text-indigo-600 font-medium">Resend</button>
      </motion.p>
    </motion.div>

);
}

// --- FILE: /components/KlikkPayment.jsx ---

"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function KlikkPayment({ userData, onComplete }) {
const [isProcessing, setIsProcessing] = useState(false);
const [isDone, setIsDone] = useState(false);

const handlePayment = () => {
setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);

      // After success animation, continue to confirmation
      setTimeout(() => {
        onComplete();
      }, 1500);
    }, 2000);

};

// Get card icon based on first digit
const getCardIcon = (cardNumber) => {
const firstDigit = cardNumber.charAt(0);
if (firstDigit === 'V') return '💳'; // Visa
if (firstDigit === 'M') return '💳'; // Mastercard
if (firstDigit === 'A') return '💳'; // Amex
return '💳'; // Default
};

return (
<motion.div
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4 }}
className="space-y-6" >
<motion.div
initial={{ y: 10, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
transition={{ delay: 0.1 }}
className="flex items-center justify-center space-x-2 mb-6" >
<div className="h-2 w-2 rounded-full bg-green-500"></div>
<div className="h-2 w-2 rounded-full bg-green-500"></div>
<div className="h-2 w-6 rounded-full bg-indigo-500"></div>
</motion.div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
          <CardContent className="p-4">
            <div className="mb-4">
              <h3 className="font-medium flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-indigo-600" />
                Pay with Klikk
              </h3>
              <p className="text-sm text-gray-600">Select your saved payment method</p>
            </div>

            <RadioGroup defaultValue="card1" className="space-y-3">
              <motion.div
                className="flex items-center space-x-2 border border-indigo-200 bg-white rounded-md p-3 cursor-pointer"
                whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(79, 70, 229, 0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <RadioGroupItem value="card1" id="card1" className="text-indigo-600" />
                <Label htmlFor="card1" className="flex-1 flex items-center cursor-pointer">
                  <div className="mr-3">{getCardIcon(userData.card)}</div>
                  <div className="flex-1">
                    <div className="font-medium">{userData.card}</div>
                    <div className="text-xs text-gray-500">Expires 09/26</div>
                  </div>
                  <div className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                    Default
                  </div>
                </Label>
              </motion.div>

              <motion.div
                className="flex items-center space-x-2 border border-gray-200 bg-white rounded-md p-3 cursor-pointer"
                whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" }}
                transition={{ duration: 0.2 }}
              >
                <RadioGroupItem value="card2" id="card2" />
                <Label htmlFor="card2" className="flex-1 flex items-center cursor-pointer">
                  <div className="mr-3">💳</div>
                  <div>
                    <div className="font-medium">Add new payment method</div>
                    <div className="text-xs text-gray-500">Credit, debit, or bank account</div>
                  </div>
                </Label>
              </motion.div>
            </RadioGroup>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center space-x-2"
      >
        <Checkbox id="save-card" defaultChecked />
        <Label htmlFor="save-card" className="text-sm cursor-pointer">
          Save my information for future Klikk checkouts
        </Label>
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          className="w-full relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          onClick={handlePayment}
          disabled={isProcessing || isDone}
        >
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </motion.div>
            ) : isDone ? (
              <motion.div
                key="success"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Payment Complete!
              </motion.div>
            ) : (
              <motion.span key="pay">
                Pay $34.98
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xs text-center text-gray-500"
      >
        By completing this purchase, you agree to Klikk's Terms of Service and Privacy Policy
      </motion.p>
    </motion.div>

);
}

// --- FILE: /components/CheckoutSummary.jsx ---

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutSummary() {
return (
<Card>
<CardHeader>
<CardTitle>Order Summary</CardTitle>
<CardDescription>1 item in your cart</CardDescription>
</CardHeader>
<CardContent>
<div className="space-y-4">
<div className="flex justify-between items-start">
<div className="flex items-center gap-4">
<div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded flex items-center justify-center">
<div className="text-xl">👕</div>
</div>
<div>
<p className="font-medium">Premium Cotton T-Shirt</p>
<p className="text-sm text-gray-500">Black | Size: M</p>
</div>
</div>
<p className="font-medium">$29.99</p>
</div>

          <div className="pt-4 border-t">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span>$29.99</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Shipping</span>
              <span>$4.99</span>
            </div>
            <div className="flex justify-between pt-2 border-t mt-2">
              <span className="font-bold">Total</span>
              <span className="font-bold">$34.98</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 text-sm text-gray-600 flex items-center justify-center p-3">
        <p>All prices include applicable taxes</p>
      </CardFooter>
    </Card>

);
}

// --- FILE: /lib/test-data.js ---

// Sample test data for the Klikk demo
export const testUsers = [
{ email: "john@example.com", name: "John Doe", card: "Visa •••• 4242" },
{ email: "jane@example.com", name: "Jane Smith", card: "Mastercard •••• 5555" },
{ email: "alex@business.com", name: "Alex Johnson", card: "Amex •••• 9876" },
{ email: "sarah@gmail.com", name: "Sarah Williams", card: "Visa •••• 1234" },
{ email: "michael@company.com", name: "Michael Brown", card: "Mastercard •••• 6789" },
{ email: "emily@outlook.com", name: "Emily Davis", card: "Discover •••• 5432" },
{ email: "david@example.org", name: "David Miller", card: "Visa •••• 8765" },
{ email: "lisa@business.net", name: "Lisa Wilson", card: "Amex •••• 2468" },
{ email: "robert@gmail.com", name: "Robert Taylor", card: "Mastercard •••• 1357" },
{ email: "jennifer@company.io", name: "Jennifer Anderson", card: "Visa •••• 3691" }
];

// Sample products data
export const products = [
{
id: 1,
name: "Premium Cotton T-Shirt",
price: 29.99,
description: "High-quality, sustainable cotton",
image: "👕"
}
];

// --- FILE: /lib/utils.js ---

// Utility functions for the Klikk demo

// Format price with currency symbol
export const formatPrice = (price) => {
return new Intl.NumberFormat('en-US', {
style: 'currency',
currency: 'USD',
}).format(price);
};

// Validate email format
export const isValidEmail = (email) => {
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return emailRegex.test(email);
};

// Generate a random order number
export const generateOrderNumber = () => {
return `KLK-${Math.floor(10000 + Math.random() * 90000)}`;
};

// Simulate API delay
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
