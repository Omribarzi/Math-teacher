import { create } from 'zustand';

export interface AuthUser {
  id: number;
  username: string;
  name: string;
  role: string;
  avatarId: string;
}

interface AuthStore {
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  token: localStorage.getItem('math-token'),
  user: (() => {
    try {
      const raw = localStorage.getItem('math-user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })(),

  setAuth: (token, user) => {
    localStorage.setItem('math-token', token);
    localStorage.setItem('math-user', JSON.stringify(user));
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem('math-token');
    localStorage.removeItem('math-user');
    localStorage.removeItem('math-player');
    localStorage.removeItem('math-progress');
    localStorage.removeItem('math-settings');
    set({ token: null, user: null });
  },

  isLoggedIn: () => !!get().token && !!get().user,
}));
