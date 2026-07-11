import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      soundEnabled: true,
      animationsEnabled: true,
      survivalMode: false, // true = Duolingo style 5 hearts, false = Unlimited
      reducedMotion: false,
      
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      toggleAnimations: () => set((state) => ({ animationsEnabled: !state.animationsEnabled })),
      toggleSurvivalMode: () => set((state) => ({ survivalMode: !state.survivalMode })),
      toggleReducedMotion: () => set((state) => ({ reducedMotion: !state.reducedMotion })),
      
      resetSettings: () => set({
        soundEnabled: true,
        animationsEnabled: true,
        survivalMode: false,
        reducedMotion: false,
      }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
