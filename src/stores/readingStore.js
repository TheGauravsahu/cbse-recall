import { create } from 'zustand';

export const useReadingStore = create((set) => ({
  scrollProgress: 0,
  readingTime: 0, // seconds spent in active session
  completed: false,
  lastPosition: 0,
  readingMode: 'normal', // 'normal' | 'focus' | 'revision'
  activeSectionId: null,

  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  incrementReadingTime: (amount = 1) => set((state) => ({ readingTime: state.readingTime + amount })),
  resetReadingSession: () => set({ readingTime: 0, scrollProgress: 0, completed: false, lastPosition: 0 }),
  setCompleted: (completed) => set({ completed }),
  setLastPosition: (position) => set({ lastPosition: position }),
  setReadingMode: (mode) => set({ readingMode: mode }),
  setActiveSectionId: (sectionId) => set({ activeSectionId: sectionId }),
}));
