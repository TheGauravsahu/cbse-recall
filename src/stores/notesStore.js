import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useNotesStore = create(
  persist(
    (set, get) => ({
      currentSubjectId: null,
      currentChapterId: null,
      recentlyOpened: [], // Array of { subjectId, chapterId, openedAt }
      readingHistory: {}, // { [subjectId/chapterId]: { timeSpent, completed, lastPosition, lastOpened } }
      personalNotes: [], // Array of { id, subjectId, chapterId, text, sectionId, createdAt }

      setCurrentSubjectAndChapter: (subjectId, chapterId) => {
        set({ currentSubjectId: subjectId, currentChapterId: chapterId });
        get().addRecentlyOpened(subjectId, chapterId);
      },

      addRecentlyOpened: (subjectId, chapterId) => set((state) => {
        const key = `${subjectId}/${chapterId}`;
        const filtered = state.recentlyOpened.filter(
          (item) => `${item.subjectId}/${item.chapterId}` !== key
        );
        const updated = [
          { subjectId, chapterId, openedAt: new Date().toISOString() },
          ...filtered,
        ].slice(0, 10); // Keep last 10
        return { recentlyOpened: updated };
      }),

      updateReadingHistory: (subjectId, chapterId, data) => set((state) => {
        const key = `${subjectId}/${chapterId}`;
        const current = state.readingHistory[key] || {
          timeSpent: 0,
          completed: false,
          lastPosition: 0,
          lastOpened: new Date().toISOString()
        };

        return {
          readingHistory: {
            ...state.readingHistory,
            [key]: {
              ...current,
              ...data,
              lastOpened: new Date().toISOString()
            }
          }
        };
      }),

      // Personal Notes (Sticky Notes)
      addPersonalNote: (subjectId, chapterId, text, sectionId) => set((state) => {
        const newNote = {
          id: `note_${Date.now()}`,
          subjectId,
          chapterId,
          text,
          sectionId,
          createdAt: new Date().toISOString()
        };
        return { personalNotes: [...state.personalNotes, newNote] };
      }),

      updatePersonalNote: (id, text) => set((state) => ({
        personalNotes: state.personalNotes.map((note) =>
          note.id === id ? { ...note, text, updatedAt: new Date().toISOString() } : note
        )
      })),

      removePersonalNote: (id) => set((state) => ({
        personalNotes: state.personalNotes.filter((note) => note.id !== id)
      })),

      getPersonalNotesForChapter: (subjectId, chapterId) => {
        return get().personalNotes.filter(
          (note) => note.subjectId === subjectId && note.chapterId === chapterId
        );
      }
    }),
    {
      name: 'cbse-notes-storage',
    }
  )
);
