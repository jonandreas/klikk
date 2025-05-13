"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import KlikkEmailInput from '@/components/KlikkEmailInput';
import KlikkVerification from '@/components/KlikkVerification';
import CheckoutSummary from '@/components/CheckoutSummary';
import AddressForm from '@/components/AddressForm';
import SavedAddressDisplay from '@/components/SavedAddressDisplay';
import SavedPaymentMethods from '@/components/SavedPaymentMethods';
import { testUsers } from '@/lib/test-data';
import { Smartphone, CheckCircle, MapPin, CreditCard } from "lucide-react";

// Define interfaces for the data structures
interface PaymentMethod {
  id: string;
  isDefault?: boolean;
  // Add other payment method properties as needed
  type?: string;
  lastFour?: string;
  expiryDate?: string;
}

interface Address {
  id?: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

interface UserData {
  id?: string;
  email?: string;
  phone?: string;
  name?: string;
  addresses?: Address[];
  paymentMethods?: PaymentMethod[];
}

interface OrderData {
  address: Address | null;
  paymentMethod: PaymentMethod | null;
}

export default function Checkout() {
  const router = useRouter();
  const [, setEmail] = useState('');
  const [step, setStep] = useState('email');
  const [isKlikkUser, setIsKlikkUser] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [orderData, setOrderData] = useState<OrderData>({
    address: null,
    paymentMethod: null
  });

  const handleEmailSubmit = (email: string, isKlikk: boolean, userData: UserData) => {
    setEmail(email);
    setIsKlikkUser(isKlikk);
    if (isKlikk) {
      setUserData(userData);
      setStep('verify');
    } else {
      // In a real app, would proceed to normal checkout with address entry
      setStep('address');
    }
  };

  const handleVerificationSuccess = () => {
    // For Klikk users, go directly to review & payment after verification
    setStep('review');
    
    // Pre-select default payment method if available
    if (userData && userData.paymentMethods && userData.paymentMethods.length > 0) {
      const defaultMethod = userData.paymentMethods.find(pm => pm.isDefault) || userData.paymentMethods[0];
      setOrderData(prev => ({
        ...prev,
        paymentMethod: defaultMethod
      }));
    }
  };

  const handleAddressSubmit = (addressData: Address) => {
    // Store the address info
    setOrderData(prev => ({
      ...prev,
      address: addressData
    }));

    // Move to payment step for non-Klikk users
    setStep('payment');
  };

  const handleAddressUpdate = (updatedUserData: UserData) => {
    // Update user data with new address
    setUserData(updatedUserData);
  };

  const handlePaymentSelect = (paymentMethod: PaymentMethod) => {
    setOrderData(prev => ({
      ...prev,
      paymentMethod
    }));
  };

  const handlePaymentComplete = () => {
    // In a real app, would process payment and create order here
    router.push('/confirmation');
  };

  // Get appropriate card title and description based on current step
  const getStepHeaderInfo = () => {
    switch (step) {
      case 'email':
        return {
          title: "Contact Information",
          description: "We'll use this to send your order confirmation"
        };
      case 'verify':
        return {
          title: "SMS Verification",
          description: "Confirm your identity with a verification code"
        };
      case 'address':
        return {
          title: "Shipping Address",
          description: "Enter your shipping details"
        };
      case 'review':
        return {
          title: "Review & Payment",
          description: "Confirm your order details and pay"
        };
      case 'payment':
        return {
          title: "Payment",
          description: "Enter your payment details"
        };
      default:
        return {
          title: "Checkout",
          description: "Complete your purchase"
        };
    }
  };

  const headerInfo = getStepHeaderInfo();

  // Determine progress steps based on whether user is authenticated
  const getProgressSteps = () => {
    if (isKlikkUser) {
      return [
        { id: 'email', label: 'Email', icon: '@' },
        { id: 'verify', label: 'Verify', icon: <Smartphone className="h-4 w-4" /> },
        { id: 'review', label: 'Payment', icon: <CreditCard className="h-4 w-4" /> }
      ];
    } else {
      return [
        { id: 'email', label: 'Email', icon: '@' },
        { id: 'address', label: 'Address', icon: <MapPin className="h-4 w-4" /> },
        { id: 'payment', label: 'Payment', icon: <CreditCard className="h-4 w-4" /> }
      ];
    }
  };

  const progressSteps = getProgressSteps();

  return (
    <div className="container mx-auto py-10 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="text-gray-500 mt-2">Complete your purchase securely</p>
      </div>

      {/* Checkout Progress Indicator */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          {progressSteps.map((progressStep, index) => (
            <div key={progressStep.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                  step === progressStep.id ? 'bg-indigo-500 text-white' : 
                  progressSteps.findIndex(s => s.id === step) > index ? 'bg-green-500 text-white' : 
                  'bg-gray-200 text-gray-500'
                }`}>
                  {progressSteps.findIndex(s => s.id === step) > index ? 
                    <CheckCircle className="h-4 w-4" /> : 
                    (typeof progressStep.icon === 'string' ? progressStep.icon : progressStep.icon)
                  }
                </div>
                <span className="text-sm">{progressStep.label}</span>
              </div>
              
              {index < progressSteps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 ${
                  progressSteps.findIndex(s => s.id === step) > index ? 'bg-green-300' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{headerInfo.title}</CardTitle>
              <CardDescription>{headerInfo.description}</CardDescription>
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
                  userData={userData}
                  onSuccess={handleVerificationSuccess}
                />
              )}

              {step === 'address' && (
                <AddressForm onSave={handleAddressSubmit} />
              )}

              {step === 'review' && userData && (
                <div className="space-y-6">
                  {/* Display saved address */}
                  <SavedAddressDisplay 
                    userData={userData} 
                    onAddressUpdate={handleAddressUpdate} 
                  />
                  
                  {/* Display saved payment methods */}
                  <SavedPaymentMethods 
                    userData={userData} 
                    onPaymentSelect={handlePaymentSelect}
                    onAddNewPayment={() => alert('Add new payment method')} 
                  />
                  
                  {/* Complete order button */}
                  <Button
                    className="w-full mt-8"
                    size="lg"
                    onClick={handlePaymentComplete}
                    disabled={!orderData.paymentMethod}
                  >
                    Complete Order
                  </Button>
                </div>
              )}

              {step === 'payment' && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 mb-4">Enter your payment details to complete your order.</p>
                  
                  {/* Simple payment form for demo */}
                  <div className="space-y-6 p-4 border rounded-md bg-gray-50">
                    <p className="font-medium">Payment form would go here in a real app</p>
                    <Button
                      onClick={handlePaymentComplete}
                      className="w-full"
                    >
                      Complete Order
                    </Button>
                  </div>
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
                    <div className="text-xl mb-2">
                      <Smartphone className="h-5 w-5 text-indigo-600" />
                    </div>
                    <h3 className="font-medium mb-1">SMS Verification</h3>
                    <p className="text-sm text-gray-600">Secure authentication via your mobile</p>
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