"use client";

import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
}

export function PricingCard({ title, price, period, features }: PricingCardProps) {
  return (
    <Card className="p-6">
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-muted-foreground">/{period}</span>
      </div>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}