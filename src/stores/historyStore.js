import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useHistoryStore = create(
  persist(
    (set) => ({
      attempts: [], // Array of attempt logs
      
      addAttempt: (attempt) => set((state) => ({
        attempts: [
          {
            id: attempt.id || Math.random().toString(36).substring(2, 9),
            subjectId: attempt.subjectId,
            chapterId: attempt.chapterId,
            score: attempt.score,
            totalQuestions: attempt.totalQuestions,
            timeTaken: attempt.timeTaken,
            xpEarned: attempt.xpEarned,
            coinsEarned: attempt.coinsEarned || 0,
            answers: attempt.answers || {},
            incorrectQuestions: attempt.incorrectQuestions || [],
            timestamp: attempt.timestamp || Date.now(),
          },
          ...state.attempts
        ]
      })),
      
      clearHistory: () => set({ attempts: [] }),
    }),
    {
      name: 'history-storage',
    }
  )
);
