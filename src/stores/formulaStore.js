import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFormulaStore = create(
  persist(
    (set, get) => ({
      bookmarkedFormulas: [], // Array of formula names
      
      toggleFormulaBookmark: (formulaName) => set((state) => {
        const isBookmarked = state.bookmarkedFormulas.includes(formulaName);
        const nextBookmarks = isBookmarked
          ? state.bookmarkedFormulas.filter(name => name !== formulaName)
          : [...state.bookmarkedFormulas, formulaName];
        return { bookmarkedFormulas: nextBookmarks };
      }),
      
      isFormulaBookmarked: (formulaName) => {
        return get().bookmarkedFormulas.includes(formulaName);
      },
      
      clearFormulaBookmarks: () => set({ bookmarkedFormulas: [] })
    }),
    {
      name: 'formula-bookmarks-storage',
    }
  )
);
