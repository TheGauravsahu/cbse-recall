import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const ACHIEVEMENTS_LIST = [
  { id: "first_quiz", title: "First Quiz", desc: "Complete your first CBSE chapter review", icon: "🚀" },
  { id: "streak_7", title: "7 Day Streak", desc: "Maintain a study streak for 7 consecutive days", icon: "🔥" },
  { id: "perfect_score", title: "100% Accuracy", desc: "Score 100% in any chapter quiz", icon: "🎯" },
  { id: "speed_master", title: "Fast Solver", desc: "Finish a complete quiz in under 30 seconds", icon: "⚡" },
  { id: "math_master", title: "Math Master", desc: "Complete the Trigonometry and Quadratic chapters", icon: "📘" },
  { id: "science_genius", title: "Science Genius", desc: "Complete the Electricity and Reactions chapters", icon: "🧠" },
  { id: "xp_500", title: "500 XP Milestone", desc: "Accumulate 500 total XP points", icon: "🏅" },
  { id: "xp_1000", title: "1000 XP Scholar", desc: "Accumulate 1000 total XP points", icon: "🏅" },
  { id: "xp_5000", title: "5000 XP Guru", desc: "Accumulate 5000 total XP points", icon: "🏅" }
];

export const useAchievementStore = create(
  persist(
    (set, get) => ({
      unlockedAchievements: [], // list of unlocked achievement IDs
      
      unlockAchievement: (id) => set((state) => {
        if (state.unlockedAchievements.includes(id)) return state;
        return {
          unlockedAchievements: [...state.unlockedAchievements, id]
        };
      }),
      
      isUnlocked: (id) => get().unlockedAchievements.includes(id),
      
      clearAchievements: () => set({ unlockedAchievements: [] })
    }),
    {
      name: 'achievements-storage',
    }
  )
);
