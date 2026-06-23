import { create } from 'zustand';

interface AppState {
  isAiSidebarOpen: boolean;
  toggleAiSidebar: () => void;
  setAiSidebarOpen: (isOpen: boolean) => void;
  currentNoteContext: string;
  setCurrentNoteContext: (context: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAiSidebarOpen: false,
  toggleAiSidebar: () => set((state) => ({ isAiSidebarOpen: !state.isAiSidebarOpen })),
  setAiSidebarOpen: (isOpen) => set({ isAiSidebarOpen: isOpen }),
  currentNoteContext: "",
  setCurrentNoteContext: (context) => set({ currentNoteContext: context }),
}));
