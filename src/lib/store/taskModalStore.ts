import { create } from "zustand";

interface TaskModalState {
  isOpen: boolean;
  isEdit: boolean;
  setOpen: (open: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
}

export const useTaskModalStore = create<TaskModalState>(set => ({
  isOpen: false,
  isEdit: false,
  setOpen: (open) => set({ isOpen: open }),
  setIsEdit: (isEdit) => set({ isEdit }),
}));

interface CategoryModalState {
  isOpen: boolean;
  isEdit: boolean;
  setOpen: (open: boolean) => void;
  setIsEdit: (isEdit: boolean) => void;
}

export const useCategoryModalStore = create<CategoryModalState>(set => ({
  isOpen: false,
  isEdit: false,
  setOpen: (open) => set({ isOpen: open }),
  setIsEdit: (isEdit) => set({ isEdit }),
})); 
