"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Compass, 
  Trophy, 
  Cpu, 
  DollarSign, 
  Palette, 
  Medal, 
  MoreHorizontal 
} from "lucide-react";

const tabs = [
  { id: "for-you", label: "For You", icon: Compass },
  { id: "top", label: "Top", icon: Trophy },
  { id: "tech", label: "Tech & Science", icon: Cpu },
  { id: "finance", label: "Finance", icon: DollarSign },
  { id: "arts", label: "Arts & Culture", icon: Palette },
  { id: "sports", label: "Sports", icon: Medal },
];

export function DiscoverTabs() {
  const [activeTab, setActiveTab] = useState("for-you");

  return (
    <div className="border-b mb-6">
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors",
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}