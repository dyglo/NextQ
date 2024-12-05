"use client";

import { Button } from "@/components/ui/button";
import { Trophy, Utensils, Zap, Phone } from "lucide-react";

const topics = [
  {
    icon: <Trophy className="h-5 w-5" />,
    title: "Summer Olympics 2024",
    description: "Latest updates and schedules",
  },
  {
    icon: <Utensils className="h-5 w-5" />,
    title: "Healthiest cooking oils",
    description: "Evidence-based comparison",
  },
  {
    icon: <Phone className="h-5 w-5" />,
    title: "Next iPhone release date",
    description: "Rumors and predictions",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Travel adapters guide",
    description: "European compatibility",
  },
];

export function TrendingTopics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mx-auto mt-8">
      {topics.map((topic) => (
        <Button
          key={topic.title}
          variant="outline"
          className="h-auto p-4 flex items-start gap-4 justify-start hover:bg-muted/50"
        >
          <div className="rounded-full p-2 bg-muted">{topic.icon}</div>
          <div className="text-left">
            <h3 className="font-semibold">{topic.title}</h3>
            <p className="text-sm text-muted-foreground">{topic.description}</p>
          </div>
        </Button>
      ))}
    </div>
  );
}