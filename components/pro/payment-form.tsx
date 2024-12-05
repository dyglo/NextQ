"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PaymentFormProps {
  selectedPlan: "monthly" | "yearly";
}

export function PaymentForm({ selectedPlan }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement payment processing
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardName">Name on Card</Label>
          <Input id="cardName" placeholder="John Doe" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input id="expiry" placeholder="MM/YY" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvc">CVC</Label>
            <Input id="cvc" placeholder="123" required />
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Processing..." : `Subscribe Now`}
        </Button>
      </form>
    </Card>
  );
}