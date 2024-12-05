"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Check, Zap, Clock, FileText, Image, Lock, Mic } from "lucide-react";
import { ProFeatureCard } from "@/components/pro/feature-card";
import { PricingCard } from "@/components/pro/pricing-card";
import { PaymentForm } from "@/components/pro/payment-form";

export default function ProPage() {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Faster Response",
      description: "Get priority access to our AI engine with reduced latency and faster processing times."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Extended History",
      description: "Keep your search history for 30 days with advanced filtering and organization options."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "PDF Analysis",
      description: "Upload and analyze PDF documents with AI-powered insights and summaries."
    },
    {
      icon: <Image className="h-6 w-6" />,
      title: "Image Search",
      description: "Search using images and screenshots with advanced visual recognition."
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Private Mode",
      description: "Enhanced privacy features with encrypted searches and automatic history clearing."
    },
    {
      icon: <Mic className="h-6 w-6" />,
      title: "Voice Search",
      description: "Advanced voice recognition for hands-free searching and commands."
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            Upgrade to NextQ Pro
          </h1>
          <p className="text-xl text-muted-foreground">
            Unlock the full potential of AI-powered search
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <ProFeatureCard key={index} {...feature} />
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={selectedPlan === "monthly" ? "default" : "outline"}
                onClick={() => setSelectedPlan("monthly")}
              >
                Monthly
              </Button>
              <Button
                variant={selectedPlan === "yearly" ? "default" : "outline"}
                onClick={() => setSelectedPlan("yearly")}
              >
                Yearly (Save 20%)
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <PricingCard
              title="Pro Monthly"
              price={selectedPlan === "monthly" ? "$9.99" : "$95.90"}
              period={selectedPlan === "monthly" ? "month" : "year"}
              features={[
                "Priority AI Access",
                "30-Day History",
                "PDF & Image Search",
                "Voice Commands",
                "Private Mode",
                "Premium Support"
              ]}
            />
            <PaymentForm selectedPlan={selectedPlan} />
          </div>
        </div>
      </div>
    </div>
  );
}