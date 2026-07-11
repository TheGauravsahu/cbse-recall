import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Spaced Repetition Days intervals mapping based on review count
const INTERVAL_DAYS = [1, 3, 7, 15, 30];

export const useRevisionStore = create(
  persist(
    (set, get) => ({
      // Map of questionId -> revisionItem
      // { questionId, subjectId, chapterId, confidence, lastAttempt, nextRevisionDate, revisionCount }
      revisionQueue: {},
      
      logQuestionAttempt: (questionId, subjectId, chapterId, isCorrect) => set((state) => {
        const queue = { ...state.revisionQueue };
        const existing = queue[questionId] || {
          questionId,
          subjectId,
          chapterId,
          confidence: 1,
          revisionCount: 0,
          lastAttempt: 0,
          nextRevisionDate: 0
        };

        let nextRevisionCount = existing.revisionCount;
        let nextConfidence = existing.confidence;

        if (isCorrect) {
          nextConfidence = Math.min(5, nextConfidence + 1);
          nextRevisionCount = Math.min(INTERVAL_DAYS.length - 1, nextRevisionCount + 1);
        } else {
          // If incorrect, drop confidence to 1 and reset interval to 1 day
          nextConfidence = 1;
          nextRevisionCount = 0; // resets to 1 day
        }

        const daysToAdd = INTERVAL_DAYS[nextRevisionCount];
        const nextTime = Date.now() + daysToAdd * 24 * 60 * 60 * 1000;

        queue[questionId] = {
          ...existing,
          confidence: nextConfidence,
          revisionCount: nextRevisionCount,
          lastAttempt: Date.now(),
          nextRevisionDate: nextTime
        };

        return { revisionQueue: queue };
      }),
      
      getDueQuestionsCount: () => {
        const queue = get().revisionQueue;
        const now = Date.now();
        return Object.values(queue).filter(
          item => item.nextRevisionDate <= now
        ).length;
      },
      
      getDueQuestions: () => {
        const queue = get().revisionQueue;
        const now = Date.now();
        return Object.values(queue).filter(
          item => item.nextRevisionDate <= now
        );
      },
      
      clearRevisionQueue: () => set({ revisionQueue: {} })
    }),
    {
      name: 'revision-storage',
    }
  )
);
