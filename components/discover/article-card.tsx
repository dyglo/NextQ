"use client";

import Image from "next/image";
import { BookmarkIcon } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useBookmarkStore } from "@/lib/store/bookmarks";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  author: {
    name: string;
    avatar: string;
  };
}

export function ArticleCard({ id, title, description, imageUrl, author }: ArticleCardProps) {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkStore();
  const bookmarked = isBookmarked(id);

  const handleBookmark = () => {
    if (bookmarked) {
      removeBookmark(id);
    } else {
      addBookmark({ id, title, description, imageUrl, author });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer"
    >
      <div className="relative aspect-[1.5] overflow-hidden rounded-lg mb-4">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <h2 className="text-xl font-semibold mb-2 line-clamp-2">{title}</h2>
      <p className="text-muted-foreground line-clamp-2 mb-4">{description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={author.avatar} />
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{author.name}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBookmark}
          className={cn(
            "opacity-0 group-hover:opacity-100 transition-opacity",
            bookmarked && "text-primary opacity-100"
          )}
        >
          <BookmarkIcon className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}