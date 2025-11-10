import { create } from "zustand";

import { IProfile } from "../types";

interface AuthState {
  user: IProfile;
  language: string;
  theme: "light" | "dark";
  setUser: (user: IProfile) => void;
  setLanguage: (lang: string) => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: {} as IProfile,
  language: "EN",
  theme: "light",
  setUser: user => set({ user }),
  setLanguage: language => set({ language }),
  setTheme: theme => set({ theme }),
}));
