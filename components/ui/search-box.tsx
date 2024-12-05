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
  const [searchResult, setSearchResult] = useState<{ answer?: string; sources?: any[]; error?: string }>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const addToHistory = useHistoryStore((state) => state.addItem);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setSearchResult(null);
    
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch results');
      }

      if (data.error) {
        setSearchResult({ error: data.error });
        return;
      }

      if (data.answer) {
        setSearchResult({
          answer: data.answer,
          sources: data.sources
        });
        
        addToHistory({
          query,
          answer: data.answer,
          sources: data.sources,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResult({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      });
    } finally {
      setIsLoading(false);
    }
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
    <div className="w-full max-w-3xl space-y-4">
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
                  <Image className="h-4 w-4" />
                </Button>
              </motion.label>
              <motion.label
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer"
              >
                <Input
                  type="file"
                  accept=".pdf"
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

      <SearchResults
        answer={searchResult?.answer}
        sources={searchResult?.sources}
        error={searchResult?.error}
        isVisible={!isLoading && !!searchResult}
      />
    </div>
  );
}