"use client";

import { useEffect, useState } from "react";
import { ArticleCard } from "./article-card";
import InfiniteScroll from "react-infinite-scroll-component";
import { motion } from "framer-motion";

const initialArticles = [
  {
    id: "1",
    title: "ChatGPT's Forbidden Names",
    description: "OpenAI's ChatGPT has been noted for its unusual behavior of refusing to process prompts containing certain names, such as \"David Mayer,\" along with others like law enforcement officials and journalists.",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    author: {
      name: "elymc",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=elymc"
    }
  },
  {
    id: "2",
    title: "Rivian's $6.6B Georgia Loan",
    description: "Rivian Automotive has secured a conditional commitment for a $6.6 billion loan from the U.S. Department of Energy to support the construction of its massive electric vehicle manufacturing facility in Georgia.",
    imageUrl: "https://images.unsplash.com/photo-1675446340253-ac30877aa789",
    author: {
      name: "aaronmut",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aaronmut"
    }
  },
  {
    id: "3",
    title: "The Future of Quantum Computing",
    description: "Recent breakthroughs in quantum computing technology promise to revolutionize fields from cryptography to drug discovery.",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    author: {
      name: "quantum_dev",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=quantum"
    }
  }
];

export function ArticleGrid() {
  const [articles, setArticles] = useState(initialArticles);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = () => {
    // Simulate API call with timeout
    setTimeout(() => {
      const newArticles = [...articles];
      for (let i = 0; i < 3; i++) {
        const randomArticle = initialArticles[Math.floor(Math.random() * initialArticles.length)];
        newArticles.push({
          ...randomArticle,
          id: `${articles.length + i + 1}`,
        });
      }
      setArticles(newArticles);
      setHasMore(articles.length < 30); // Limit to 30 articles for demo
    }, 1500);
  };

  return (
    <InfiniteScroll
      dataLength={articles.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<h4 className="text-center py-4">Loading...</h4>}
      endMessage={
        <p className="text-center py-4 text-muted-foreground">
          No more articles to load.
        </p>
      }
    >
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        layout
      >
        {articles.map((article) => (
          <ArticleCard key={article.id} {...article} />
        ))}
      </motion.div>
    </InfiniteScroll>
  );
}