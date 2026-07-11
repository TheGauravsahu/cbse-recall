import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useProgressStore = create(
  persist(
    (set, get) => ({
      xp: 0,
      coins: 0,
      level: 1,
      streak: 0,
      lastActiveDate: null, // "YYYY-MM-DD"
      completedChapters: [], // Array of "subjectId/chapterId"
      recentActivity: [], // Array of { id, text, timestamp }
      
      addXp: (amount) => {
        const currentXp = get().xp;
        const newXp = currentXp + amount;
        
        // Level logic: 150 XP per level
        const newLevel = Math.floor(newXp / 150) + 1;
        const levelUp = newLevel > get().level;
        
        set((state) => ({
          xp: newXp,
          level: newLevel,
        }));
        
        return levelUp; // returns boolean for level-up chimes
      },
      
      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
      
      completeChapter: (subjectId, chapterId) => {
        const key = `${subjectId}/${chapterId}`;
        set((state) => {
          if (state.completedChapters.includes(key)) return state;
          return {
            completedChapters: [...state.completedChapters, key]
          };
        });
      },
      
      updateStreak: () => {
        const todayStr = new Date().toISOString().split('T')[0];
        const lastDateStr = get().lastActiveDate;
        
        if (!lastDateStr) {
          set({
            streak: 1,
            lastActiveDate: todayStr
          });
          get().logActivity("Started your learning companion journey!");
          return;
        }
        
        const lastDate = new Date(lastDateStr);
        const today = new Date(todayStr);
        const diffTime = Math.abs(today - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          set((state) => ({
            streak: state.streak + 1,
            lastActiveDate: todayStr
          }));
          get().logActivity(`Continued your streak! Streak: ${get().streak} days.`);
        } else if (diffDays > 1) {
          set({
            streak: 1,
            lastActiveDate: todayStr
          });
          get().logActivity("Streak reset. Starting a new streak today!");
        }
      },
      
      logActivity: (text) => set((state) => ({
        recentActivity: [
          {
            id: Math.random().toString(36).substring(2, 9),
            text,
            timestamp: Date.now()
          },
          ...state.recentActivity
        ].slice(0, 20)
      })),
      
      resetProgress: () => set({
        xp: 0,
        coins: 0,
        level: 1,
        streak: 0,
        lastActiveDate: null,
        completedChapters: [],
        recentActivity: [],
      }),
    }),
    {
      name: 'progress-storage',
    }
  )
);
