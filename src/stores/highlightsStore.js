import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useHighlightsStore = create(
  persist(
    (set, get) => ({
      highlights: [], // Array of { id, subjectId, chapterId, text, color, elementId, createdAt }

      addHighlight: (subjectId, chapterId, text, color, elementId) => set((state) => {
        // Prevent duplicate highlights on identical selections
        const exists = state.highlights.some(
          (h) => h.subjectId === subjectId && h.chapterId === chapterId && h.text === text && h.elementId === elementId
        );
        if (exists) return state;

        const newHighlight = {
          id: `hl_${Date.now()}`,
          subjectId,
          chapterId,
          text,
          color, // 'yellow' | 'blue' | 'green' | 'pink'
          elementId,
          createdAt: new Date().toISOString()
        };
        return { highlights: [...state.highlights, newHighlight] };
      }),

      removeHighlight: (id) => set((state) => ({
        highlights: state.highlights.filter((h) => h.id !== id)
      })),

      clearHighlights: (subjectId, chapterId) => set((state) => ({
        highlights: state.highlights.filter(
          (h) => !(h.subjectId === subjectId && h.chapterId === chapterId)
        )
      })),

      getHighlightsForChapter: (subjectId, chapterId) => {
        return get().highlights.filter(
          (h) => h.subjectId === subjectId && h.chapterId === chapterId
        );
      }
    }),
    {
      name: 'cbse-notes-highlights-storage',
    }
  )
);
