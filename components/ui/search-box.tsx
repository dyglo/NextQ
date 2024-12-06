"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Image, FileText, Mic, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useHistoryStore } from "@/lib/store/history";
import { SearchResults } from "@/components/search/search-results";

export function SearchBox() {
  const [query, setQuery] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [conversations, setConversations] = useState<Array<{
    query: string;
    answer?: string;
    sources?: any[];
    error?: string;
    suggestions?: string[];
    context?: string;
  }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const addToHistory = useHistoryStore((state) => state.addItem);

  const generateSuggestions = (query: string, answer: string, previousContext?: string): string[] => {
    // Generate context-aware follow-up questions
    const baseQuestions = [
      `Can you explain more about ${query.split(' ').slice(-2).join(' ')}?`,
      `What are the latest updates on this topic?`,
      `How does this compare to previous similar cases?`,
      `What are the practical implications of this?`
    ];

    // If there's previous context, add more specific follow-up questions
    if (previousContext) {
      const contextWords = previousContext.split(' ')
        .filter(word => word.length > 4)
        .slice(-3);
      
      baseQuestions.push(
        `How does this relate to ${contextWords.join(' ')}?`,
        `What's the connection between this and the previous topic?`
      );
    }

    return baseQuestions;
  };

  const starterSuggestions = [
    {
      title: "Summer Olympics 2024",
      description: "Latest updates and schedules",
      icon: "🏆"
    },
    {
      title: "Healthiest cooking oils",
      description: "Evidence-based comparison",
      icon: "🥘"
    },
    {
      title: "AI technology trends",
      description: "Current developments and future outlook",
      icon: "🤖"
    },
    {
      title: "Sustainable living tips",
      description: "Practical everyday solutions",
      icon: "🌱"
    }
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    
    try {
      // Get the previous conversation context if it exists
      const previousContext = conversations.length > 0 ? conversations[conversations.length - 1].context : undefined;

      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query,
          previousContext 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch results');
      }

      if (data.error) {
        setConversations(prev => [...prev, { query, error: data.error }]);
        return;
      }

      if (data.answer) {
        const suggestions = generateSuggestions(query, data.answer, previousContext);
        setConversations(prev => [...prev, {
          query,
          answer: data.answer,
          sources: data.sources,
          suggestions,
          context: data.context
        }]);
        
        addToHistory({
          query,
          answer: data.answer,
          sources: data.sources || []
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      setConversations(prev => [...prev, {
        query,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }]);
    } finally {
      setIsLoading(false);
      setHasSearched(true);
      setQuery("");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(new Event('submit') as any);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);
    try {
      // TODO: Implement file upload API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setQuery(`Analyzing ${file.name}...`);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Voice input is not supported in your browser");
      return;
    }

    try {
      setIsRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // TODO: Implement voice recognition
      await new Promise(resolve => setTimeout(resolve, 2000));
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error("Voice input error:", error);
    } finally {
      setIsRecording(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Title and subtitle only shown before first search */}
      {!hasSearched && (
        <>
          {/* Search Input for Initial State */}
          <div className="w-full mb-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask anything..."
                    className="pr-32"
                    disabled={isLoading}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <motion.label
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer"
                    >
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={isLoading}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </motion.label>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleVoiceInput}
                        disabled={isLoading}
                      >
                        <Mic className={`h-4 w-4 ${isRecording ? "text-primary animate-pulse" : ""}`} />
                      </Button>
                    </motion.div>
                  </div>
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Starter Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {starterSuggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="w-full p-4 h-auto flex items-start gap-3 text-left"
                  onClick={() => handleSuggestionClick(suggestion.title)}
                >
                  <span className="text-2xl">{suggestion.icon}</span>
                  <div>
                    <div className="font-medium">{suggestion.title}</div>
                    <div className="text-sm text-muted-foreground">{suggestion.description}</div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Conversations */}
      {conversations.map((conv, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Query */}
          <div className="mb-4 text-sm text-muted-foreground">
            You asked: {conv.query}
          </div>

          {/* Response */}
          <SearchResults
            answer={conv.answer}
            sources={conv.sources}
            error={conv.error}
            isVisible={true}
          />

          {/* Suggestions */}
          {conv.suggestions && (
            <div className="mt-4 flex flex-wrap gap-2">
              {conv.suggestions.map((suggestion, sIdx) => (
                <Button
                  key={sIdx}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-sm"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          )}
        </motion.div>
      ))}
      
      {/* Search Input for After Search */}
      {hasSearched && (
        <motion.div
          layout
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 100
          }}
          className="w-full sticky bottom-4 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 rounded-lg border mt-8"
        >
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask anything..."
                  className="pr-32"
                  disabled={isLoading}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <motion.label
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer"
                  >
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      disabled={isLoading}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </motion.label>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleVoiceInput}
                      disabled={isLoading}
                    >
                      <Mic className={`h-4 w-4 ${isRecording ? "text-primary animate-pulse" : ""}`} />
                    </Button>
                  </motion.div>
                </div>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}