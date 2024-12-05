import { DiscoverHeader } from "@/components/discover/header";
import { DiscoverTabs } from "@/components/discover/tabs";
import { ArticleGrid } from "@/components/discover/article-grid";

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4">
        <DiscoverHeader />
        <DiscoverTabs />
        <ArticleGrid />
      </div>
    </div>
  );
}