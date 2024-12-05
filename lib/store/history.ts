import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HistoryItem {
  id: string;
  query: string;
  answer: string;
  timestamp: number;
  type?: 'text' | 'image' | 'pdf' | 'voice';
}

interface HistoryStore {
  items: HistoryItem[];
  addItem: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  removeItem: (id: string) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: [
            {
              ...item,
              id: crypto.randomUUID(),
              timestamp: Date.now(),
            },
            ...state.items,
          ],
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clearHistory: () => set({ items: [] }),
    }),
    {
      name: 'nextq-history',
    }
  )
);