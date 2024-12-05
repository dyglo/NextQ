import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Bookmark {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  author: {
    name: string;
    avatar: string;
  };
}

interface BookmarkStore {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      addBookmark: (bookmark) => 
        set((state) => ({
          bookmarks: [...state.bookmarks, bookmark]
        })),
      removeBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id)
        })),
      isBookmarked: (id) =>
        get().bookmarks.some((bookmark) => bookmark.id === id),
    }),
    {
      name: 'nextq-bookmarks',
    }
  )
);