import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: {
        name: "Gaurav Sahu",
        avatar: "🎓",
        grade: "Class 10 (CBSE)",
        favoriteSubject: "maths"
      },
      updateUser: (fields) => set((state) => ({
        user: { ...state.user, ...fields }
      })),
    }),
    {
      name: 'auth-storage',
    }
  )
);
