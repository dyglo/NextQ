"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export function ProUpgrade() {
  const router = useRouter();

  return (
    <div className="rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-4">
      <h3 className="flex items-center gap-2 font-semibold">
        <Sparkles className="h-4 w-4 text-primary" />
        Upgrade to Pro
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get access to advanced features and priority support
      </p>
      <Button 
        className="mt-3 w-full" 
        size="sm"
        onClick={() => router.push("/pro")}
      >
        Try Pro Features
      </Button>
    </div>
  );
}