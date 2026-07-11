import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useBookmarksStore = create(
  persist(
    (set, get) => ({
      bookmarkedSections: [], // Array of { id, subjectId, chapterId, headingText, elementId }
      bookmarkedChapters: [], // Array of "subjectId/chapterId" strings

      toggleChapterBookmark: (subjectId, chapterId) => set((state) => {
        const key = `${subjectId}/${chapterId}`;
        const exists = state.bookmarkedChapters.includes(key);
        return {
          bookmarkedChapters: exists
            ? state.bookmarkedChapters.filter((k) => k !== key)
            : [...state.bookmarkedChapters, key]
        };
      }),

      isChapterBookmarked: (subjectId, chapterId) => {
        const key = `${subjectId}/${chapterId}`;
        return get().bookmarkedChapters.includes(key);
      },

      toggleSectionBookmark: (subjectId, chapterId, headingText, elementId) => set((state) => {
        const exists = state.bookmarkedSections.some(
          (sec) => sec.subjectId === subjectId && sec.chapterId === chapterId && sec.elementId === elementId
        );

        if (exists) {
          return {
            bookmarkedSections: state.bookmarkedSections.filter(
              (sec) => !(sec.subjectId === subjectId && sec.chapterId === chapterId && sec.elementId === elementId)
            )
          };
        } else {
          const newBookmark = {
            id: `bmark_${Date.now()}`,
            subjectId,
            chapterId,
            headingText,
            elementId
          };
          return {
            bookmarkedSections: [...state.bookmarkedSections, newBookmark]
          };
        }
      }),

      isSectionBookmarked: (subjectId, chapterId, elementId) => {
        return get().bookmarkedSections.some(
          (sec) => sec.subjectId === subjectId && sec.chapterId === chapterId && sec.elementId === elementId
        );
      }
    }),
    {
      name: 'cbse-notes-bookmarks-storage',
    }
  )
);
