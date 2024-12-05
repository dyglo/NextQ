import { SearchBox } from "@/components/ui/search-box";
import { TrendingTopics } from "@/components/trending-topics";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-24 bg-background">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
          NextQ your Intelligent search
        </h1>
        <p className="text-lg text-muted-foreground">
          Experience AI-powered search that understands you
        </p>
      </div>

      <SearchBox />
      <TrendingTopics />
    </main>
  );
}