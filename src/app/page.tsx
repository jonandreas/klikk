"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation';

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