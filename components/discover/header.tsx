"use client";

import { Globe } from "lucide-react";

export function DiscoverHeader() {
  return (
    <div className="flex items-center gap-3 py-8">
      <Globe className="h-8 w-8" />
      <h1 className="text-4xl font-bold">Discover</h1>
    </div>
  );
}