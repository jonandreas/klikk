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