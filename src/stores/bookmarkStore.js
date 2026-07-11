import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useBookmarkStore = create(
  persist(
    (set, get) => ({
      bookmarks: [], // Array of question IDs
      
      addBookmark: (questionId) => set((state) => {
        if (state.bookmarks.includes(questionId)) return state;
        return { bookmarks: [...state.bookmarks, questionId] };
      }),
      
      removeBookmark: (questionId) => set((state) => ({
        bookmarks: state.bookmarks.filter(id => id !== questionId)
      })),
      
      isBookmarked: (questionId) => {
        return get().bookmarks.includes(questionId);
      },
      
      clearBookmarks: () => set({ bookmarks: [] }),
    }),
    {
      name: 'bookmarks-storage',
    }
  )
);
