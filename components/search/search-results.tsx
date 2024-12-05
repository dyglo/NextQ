"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Globe, ExternalLink } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Source {
  title: string;
  snippet: string;
  link: string;
  position: number;
}

interface SearchResultsProps {
  answer?: string;
  sources?: Source[];
  error?: string;
  isVisible: boolean;
}

export function SearchResults({ answer, sources, error, isVisible }: SearchResultsProps) {
  if (!isVisible) return null;

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 w-full max-w-3xl"
      >
        <div className="rounded-lg border border-destructive bg-destructive/10 p-6">
          <div className="flex items-center gap-2 text-destructive">
            <span className="text-sm font-medium">Error: {error}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!answer) return null;

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

  // Process the answer to create source reference links
  const processAnswer = (text: string) => {
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

  const processedAnswer = processAnswer(answer);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 w-full max-w-3xl space-y-6"
    >
      {/* Sources Section */}
      {sources && sources.length > 0 && (
        <div className="rounded-lg border bg-card p-4">
          <h3 className="mb-3 text-sm font-medium text-primary">Sources</h3>
          <div className="space-y-2">
            {sources.map((source, index) => (
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
      <div className="rounded-lg border bg-card p-6">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
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
            {processedAnswer}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}
