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