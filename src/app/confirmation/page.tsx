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