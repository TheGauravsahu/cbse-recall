import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => {
        const nextTheme = state.theme === 'light' ? 'dark' : 'light';
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { theme: nextTheme };
      }),
      initTheme: () => {
        const stored = localStorage.getItem('theme-storage');
        let theme = 'light';
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            theme = parsed.state?.theme || 'light';
          } catch (e) {
            console.error("Failed to parse theme storage", e);
          }
        }
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ theme });
      }
    }),
    {
      name: 'theme-storage',
    }
  )
);
