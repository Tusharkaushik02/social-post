import { create } from 'zustand';
import { authApi } from '@/api/auth.api';
import { STORAGE_KEYS } from '@/config/constants';
import { currentMockUser } from '@/data/mockData';
import { useUIStore } from '@/stores/useUIStore';

function getStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistSession(token, user) {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
}

function normalizeAuthPayload(data, fallback = currentMockUser) {
  const user = data?.user || fallback;
  const token = data?.token || data?.accessToken || `mock-token-${Date.now()}`;
  return { user, token };
}

export const useAuthStore = create((set, get) => ({
  user: getStoredUser(),
  token: localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || null,
  isAuthenticated: Boolean(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      let payload;
      try {
        const { data } = await authApi.login(credentials);
        payload = normalizeAuthPayload(data);
      } catch (error) {
        if (error.response?.status && error.response.status < 500) {
          throw error;
        }
        payload = normalizeAuthPayload(null, {
          ...currentMockUser,
          email: credentials.email || currentMockUser.email,
        });
      }

      persistSession(payload.token, payload.user);
      useUIStore.getState().closeAuthModal();
      set({
        user: payload.user,
        token: payload.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return payload.user;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      let payload;
      try {
        const { data } = await authApi.register(userData);
        payload = normalizeAuthPayload(data);
      } catch (error) {
        if (error.response?.status && error.response.status < 500) {
          throw error;
        }
        payload = normalizeAuthPayload(null, {
          ...currentMockUser,
          username: userData.username,
          displayName: userData.username,
          email: userData.email,
        });
      }

      persistSession(payload.token, payload.user);
      useUIStore.getState().closeAuthModal();
      set({
        user: payload.user,
        token: payload.token,
        isAuthenticated: true,
        isLoading: false,
      });
      return payload.user;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    clearSession();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
    authApi.logout().catch(() => {});
  },

  checkAuth: async () => {
    const token = get().token;
    if (!token) return;

    set({ isLoading: true });
    try {
      const { data } = await authApi.getMe();
      const user = data.user || data;
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      const storedUser = getStoredUser();
      if (storedUser) {
        set({ user: storedUser, isAuthenticated: true, isLoading: false });
        return;
      }
      clearSession();
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
