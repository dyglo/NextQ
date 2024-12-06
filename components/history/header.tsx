"use client";

import { BookMarked, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useHistoryStore } from "@/lib/store/history";

export function HistoryHeader() {
  const clearHistory = useHistoryStore((state) => state.clearHistory);

  return (
    <div className="flex items-center justify-between gap-3 mb-6 px-4">
      <div className="flex items-center gap-3">
        <BookMarked className="h-8 w-8" />
        <h1 className="text-4xl font-bold">Library</h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={clearHistory} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear History
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}