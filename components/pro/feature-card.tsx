"use client";

import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface ProFeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function ProFeatureCard({ icon, title, description }: ProFeatureCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
}