// src/store/settingsStore.ts
import { create } from "zustand";

interface SettingsState {
  showAddUserForm: boolean;
  showEditUserForm: boolean;

  // Actions
  toggleAddUserForm: () => void;
  toggleEditUserForm: () => void;
}

export const useSettingsStore = create<SettingsState>(set => ({
  showAddUserForm: false,
  showEditUserForm: false,

  toggleAddUserForm: () =>
    set(state => ({
      showAddUserForm: !state.showAddUserForm,
    })),

  toggleEditUserForm: () =>
    set(state => ({
      showEditUserForm: !state.showEditUserForm,
    })),
}));
