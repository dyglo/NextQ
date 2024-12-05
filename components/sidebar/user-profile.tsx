"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogIn } from "lucide-react";

export function UserProfile() {
  const user = null; // TODO: Implement authentication

  if (!user) {
    return (
      <Button variant="ghost" className="w-full justify-start gap-2">
        <LogIn className="h-4 w-4" />
        Sign In
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3 p-2">
      <Avatar>
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="text-sm font-medium">User Name</p>
        <p className="text-xs text-muted-foreground">user@example.com</p>
      </div>
    </div>
  );
}