"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPhoneNumber } from "@/lib/twilio-service";
import { motion } from "framer-motion";
import { MapPin, Edit2, Check } from "lucide-react";
import AddressForm from './AddressForm';

export default function SavedAddressDisplay({ userData, onAddressUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  
  if (!userData || !userData.address) {
    return null;
  }
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  const handleSave = (updatedAddress) => {
    // Update the address
    onAddressUpdate({
      ...userData,
      address: {
        ...updatedAddress,
      },
      mobile: updatedAddress.mobile,
      name: updatedAddress.name
    });
    
    // Exit edit mode
    setIsEditing(false);
  };
  
  if (isEditing) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="font-medium mb-4">Edit Shipping Address</h3>
          <AddressForm 
            savedAddress={{
              name: userData.name,
              ...userData.address,
              mobile: userData.mobile
            }}
            isEditing={true}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    );
  }
  
  const { address } = userData;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-100">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <div className="mr-3 mt-1 text-indigo-500">
                <MapPin size={18} />
              </div>
              <div>
                <h3 className="font-medium mb-1">Shipping Address</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{userData.name}</p>
                  <p>{address.street}</p>
                  <p>{address.postalCode} {address.city}</p>
                  <p>{address.country}</p>
                  <p className="pt-1">{formatPhoneNumber(userData.mobile)}</p>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-2 text-xs border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              onClick={handleEdit}
            >
              <Edit2 size={14} className="mr-1" /> Edit
            </Button>
          </div>
          
          <div className="mt-4 pt-3 border-t border-indigo-100 flex items-center">
            <Check size={14} className="text-green-500 mr-2" />
            <span className="text-xs text-gray-600">Information saved to your Klikk account</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}