"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { MoreHorizontal, Trash2, ExternalLink, Globe } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useHistoryStore } from "@/lib/store/history";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function HistoryList() {
  const items = useHistoryStore((state) => state.items);
  const removeItem = useHistoryStore((state) => state.removeItem);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getSourceIcon = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return (
        <div className="relative h-4 w-4 rounded-full overflow-hidden">
          <Image
            src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`}
            alt={hostname}
            width={16}
            height={16}
            className="object-cover"
          />
        </div>
      );
    } catch {
      return <Globe className="h-4 w-4" />;
    }
  };

  const processAnswer = (text: string, sources: any[]) => {
    // Remove markdown-style bold markers
    text = text.replace(/\*\*/g, '');
    
    // Replace [n] references with links
    sources?.forEach((source, index) => {
      const ref = `[${index + 1}]`;
      text = text.replace(new RegExp(`\\${ref}`, 'g'), 
        `[${ref}](${source.link})`);
    });

    // Format section headers
    text = text.replace(/###\s+([^\n]+)/g, '## $1');

    return text;
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No history items yet</p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="space-y-4">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card rounded-lg border p-4 space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{item.query}</h3>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(item.timestamp), "MMM d, yyyy 'at' h:mm a")}
                  </span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Sources Section */}
            {item.sources && item.sources.length > 0 && (
              <div className="rounded-lg border bg-card p-4">
                <h3 className="mb-3 text-sm font-medium text-primary">Sources</h3>
                <div className="space-y-2">
                  {item.sources.map((source: any, index: number) => (
                    <a
                      key={source.position}
                      href={source.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 rounded-md p-2 hover:bg-accent/50 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        {getSourceIcon(source.link)}
                        <span className="text-xs font-medium text-primary">[{index + 1}]</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                          {source.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {source.link}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Answer Section */}
            <div 
              className="rounded-lg border bg-card p-6"
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
              <div className={`prose prose-sm dark:prose-invert max-w-none ${expandedId !== item.id && 'line-clamp-3'}`}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 {...props} className="text-lg font-semibold mt-6 mb-3 first:mt-0" />
                    ),
                    p: ({ node, ...props }) => (
                      <p {...props} className="mb-4 last:mb-0 leading-relaxed" />
                    ),
                  }}
                >
                  {processAnswer(item.answer, item.sources)}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}