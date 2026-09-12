import { create } from 'zustand';

const TOKEN_KEY = 'bc_system_token';

export function readToken() {
  return (
    sessionStorage.getItem(TOKEN_KEY) ??
    localStorage.getItem(TOKEN_KEY)
  );
}

function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export const useAuthStore = create((set) => ({
  token: readToken(),
  login: (token, remember) => {
    clearToken();
    (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
    set({ token });
  },
  logout: () => {
    clearToken();
    set({ token: null });
  },
}));

export function useIsAuthenticated() {
  return useAuthStore((state) => Boolean(state.token));
}