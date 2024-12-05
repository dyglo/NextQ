import { HistoryHeader } from "@/components/history/header";
import { HistoryList } from "@/components/history/list";
import { SearchHistory } from "@/components/history/search";

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container mx-auto px-4 py-8">
        <HistoryHeader />
        <SearchHistory />
        <HistoryList />
      </div>
    </div>
  );
}