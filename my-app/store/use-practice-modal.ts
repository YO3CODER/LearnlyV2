import { create } from "zustand";

type PracticeModalState = {
  isOpen: boolean;
  lessonId: number | null;
  open: (lessonId: number) => void;
  close: () => void;
};

export const usePracticeModal = create<PracticeModalState>((set) => ({
  isOpen: false,
  lessonId: null,
  open: (lessonId: number) => set({ isOpen: true, lessonId }),
  close: () => set({ isOpen: false, lessonId: null }),
}));