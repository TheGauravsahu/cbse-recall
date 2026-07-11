import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUiStore = create(
  persist(
    (set) => ({
      activeTab: 'dashboard', // 'dashboard' | 'subjects' | 'revision' | 'formulas' | 'settings'
      searchModalOpen: false,
      
      setTab: (tab) => set({ activeTab: tab }),
      toggleSearchModal: () => set((state) => ({ searchModalOpen: !state.searchModalOpen })),
      setSearchModal: (isOpen) => set({ searchModalOpen: isOpen })
    }),
    {
      name: 'ui-state-storage',
    }
  )
);
