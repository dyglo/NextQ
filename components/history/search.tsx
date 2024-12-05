"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchHistory() {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search your threads..."
        className="pl-9 bg-muted/50"
      />
    </div>
  );
}