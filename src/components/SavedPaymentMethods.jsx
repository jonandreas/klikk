"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { CreditCard, PlusCircle } from "lucide-react";

export default function SavedPaymentMethods({ userData, onPaymentSelect, onAddNewPayment }) {
  const [selectedPaymentId, setSelectedPaymentId] = useState(() => {
    // Default to the user's default payment method
    if (userData && userData.paymentMethods && userData.paymentMethods.length > 0) {
      const defaultMethod = userData.paymentMethods.find(pm => pm.isDefault);
      return defaultMethod ? defaultMethod.id : userData.paymentMethods[0].id;
    }
    return null;
  });
  
  if (!userData || !userData.paymentMethods || userData.paymentMethods.length === 0) {
    return null;
  }
  
  const handlePaymentChange = (id) => {
    setSelectedPaymentId(id);
    
    const selectedMethod = userData.paymentMethods.find(pm => pm.id === id);
    if (onPaymentSelect && selectedMethod) {
      onPaymentSelect(selectedMethod);
    }
  };
  
  // Get payment method icon based on type
  const getPaymentIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'visa':
        return '💳 Visa';
      case 'mastercard':
        return '💳 Mastercard';
      case 'amex':
        return '💳 Amex';
      case 'discover':
        return '💳 Discover';
      case 'paypal':
        return '📱 PayPal';
      default:
        return '💳';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center mb-4">
            <CreditCard className="h-5 w-5 text-indigo-600 mr-2" />
            <h3 className="font-medium">Saved Payment Methods</h3>
          </div>
          
          <RadioGroup 
            value={selectedPaymentId} 
            onValueChange={handlePaymentChange}
            className="space-y-3"
          >
            {userData.paymentMethods.map(paymentMethod => (
              <motion.div
                key={paymentMethod.id}
                whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(79, 70, 229, 0.1)" }}
                transition={{ duration: 0.2 }}
                className={`flex items-center space-x-2 border ${
                  selectedPaymentId === paymentMethod.id 
                    ? 'border-indigo-200 bg-indigo-50' 
                    : 'border-gray-200 bg-white'
                } rounded-md p-3 cursor-pointer`}
              >
                <RadioGroupItem 
                  value={paymentMethod.id} 
                  id={paymentMethod.id} 
                  className="text-indigo-600" 
                />
                <Label htmlFor={paymentMethod.id} className="flex-1 flex items-center cursor-pointer">
                  <div className="mr-3 text-sm">{getPaymentIcon(paymentMethod.type)}</div>
                  <div className="flex-1">
                    <div className="font-medium">{paymentMethod.label}</div>
                    {paymentMethod.expiryDate && (
                      <div className="text-xs text-gray-500">Expires {paymentMethod.expiryDate}</div>
                    )}
                  </div>
                  {paymentMethod.isDefault && (
                    <div className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                      Default
                    </div>
                  )}
                </Label>
              </motion.div>
            ))}
            
            {/* Add new payment method option */}
            <div 
              className="flex items-center space-x-2 border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-md p-3 cursor-pointer"
              onClick={onAddNewPayment}
            >
              <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center">
                <PlusCircle className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-700">Add new payment method</div>
                <div className="text-xs text-gray-500">Credit, debit, or bank account</div>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </motion.div>
  );
}