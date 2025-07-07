import { create } from 'zustand';

interface User {
  name: string;
  avatar: string;
}

interface AuthState {
  user: User;
  language: string;
  theme: 'light' | 'dark';
  setUser: (user: User) => void;
  setLanguage: (lang: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    name: 'Sara M Ali',
    avatar: '/images/default-profile-image.jpg',
  },
  language: 'EN',
  theme: 'light',
  setUser: (user) => set({ user }),
  setLanguage: (language) => set({ language }),
  setTheme: (theme) => set({ theme }),
})); 