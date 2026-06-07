import { create } from 'zustand';
import { authApi } from '@/api/auth.api';
import { useUIStore } from '@/stores/useUIStore';

/**
 * Normalize backend user object to frontend field names.
 * Backend model: displayname (lowercase n), avatarUrl
 * Frontend expects: displayName, avatar
 */
function normalizeUser(raw) {
  if (!raw) return null;
  return {
    ...raw,
    displayName: raw.displayName || raw.displayname || raw.username || '',
    avatar: raw.avatar || raw.avatarUrl || '',
  };
}

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  /**
   * Login with email and password.
   * Backend sets httpOnly cookie automatically.
   * Then we fetch the full user via /auth/me.
   *
   * @param {{ email: string, password: string }} credentials
   */
  login: async (credentials) => {
    console.log('[useAuthStore.login] Logging in with email:', credentials.email);
    set({ isLoading: true, error: null });

    try {
      const loginRes = await authApi.login(credentials);
      const loginUser = loginRes.data?.user;

      // If login response includes user data, use it directly
      if (loginUser) {
        const user = normalizeUser(loginUser);
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        console.log('[useAuthStore.login] Login successful');
        return user;
      }

      // Otherwise fetch user from /auth/me
      const { data } = await authApi.getMe();
      const user = normalizeUser(data.user || data);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      console.log('[useAuthStore.login] Login successful');
      return user;
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Login failed';
      console.error('[useAuthStore.login] Error:', message);
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  /**
   * Register a new user account.
   * Backend sets httpOnly cookie automatically.
   *
   * @param {{ username: string, email: string, password: string }} userData
   */
  register: async (userData) => {
    console.log('[useAuthStore.register] Registering user:', userData.email);
    set({ isLoading: true, error: null });

    try {
      const registerRes = await authApi.register(userData);
      const registeredUser = registerRes.data?.user;

      if (registeredUser) {
        const user = normalizeUser(registeredUser);
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        console.log('[useAuthStore.register] Registration successful');
        return user;
      }

      // Fallback: fetch via /auth/me
      const { data } = await authApi.getMe();
      const user = normalizeUser(data.user || data);

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      console.log('[useAuthStore.register] Registration successful');
      return user;
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Registration failed';
      console.error('[useAuthStore.register] Error:', message);
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  /**
   * Logout the current user.
   * Clears state and calls backend to clear the httpOnly cookie.
   */
  logout: async () => {
    console.log('[useAuthStore.logout] Logging out');
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });

    try {
      await authApi.logout();
    } catch (error) {
      console.warn('[useAuthStore.logout] Backend logout failed (cookie may already be expired):', error.message);
    }
  },

  /**
   * Check if user has valid auth session on app load.
   * Calls GET /auth/me — if the cookie is valid, returns user data.
   */
  checkAuth: async () => {
    console.log('[useAuthStore.checkAuth] Checking authentication...');
    set({ isLoading: true });

    try {
      const { data } = await authApi.getMe();
      const user = normalizeUser(data.user || data);

      console.log('[useAuthStore.checkAuth] User authenticated:', user?.email);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.log('[useAuthStore.checkAuth] Not authenticated');
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  /**
   * Clear session state without calling backend.
   * Used by axios interceptor on 401.
   */
  clearSession: () => {
    console.log('[useAuthStore.clearSession] Clearing session');
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));
