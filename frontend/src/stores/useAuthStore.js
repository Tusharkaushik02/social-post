import { create } from 'zustand';
import { authApi } from '@/api/auth.api';
import { STORAGE_KEYS } from '@/config/constants';
import { currentMockUser } from '@/data/mockData';
import { useUIStore } from '@/stores/useUIStore';

function getStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('[useAuthStore] Error parsing stored user:', error);
    return null;
  }
}

function persistSession(token, user) {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
  console.log('[useAuthStore] Session persisted for user:', user?.email);
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  console.log('[useAuthStore] Session cleared');
}

/**
 * Generate a mock authentication token
 * @param {object} user - User object
 * @returns {string} Mock JWT-like token
 */
function generateMockToken(user) {
  // Simple mock token that includes user info in base64
  const payload = btoa(JSON.stringify({ user, iat: Date.now() }));
  return `mock-${payload}`;
}

export const useAuthStore = create((set, get) => ({
  user: getStoredUser(),
  token: localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || null,
  isAuthenticated: Boolean(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)),
  isLoading: false,
  error: null,

  /**
   * Login with email and password
   * 
   * NOTE: Backend doesn't have /auth/login endpoint
   * Using client-side mock authentication with localStorage
   * 
   * @param {object} credentials - { email: string, password: string }
   */
  login: async (credentials) => {
    console.log('[useAuthStore.login] Logging in with email:', credentials.email);
    set({ isLoading: true, error: null });
    
    try {
      // Create mock user with provided email
      const mockUser = {
        ...currentMockUser,
        email: credentials.email,
      };

      // Generate mock token
      const token = generateMockToken(mockUser);

      // Persist session (localStorage)
      persistSession(token, mockUser);

      // Close auth modal and update store
      try {
        useUIStore.getState().closeAuthModal();
      } catch (e) {
        console.warn('[useAuthStore.login] Could not close auth modal:', e);
      }

      set({
        user: mockUser,
        token: token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      console.log('[useAuthStore.login] Login successful');
      return mockUser;
    } catch (error) {
      const message = error.message || 'Login failed';
      console.error('[useAuthStore.login] Error:', message);
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  /**
   * Register a new user account
   * 
   * NOTE: Backend doesn't have /auth/register endpoint
   * Using client-side mock authentication with localStorage
   * 
   * @param {object} userData - { username, email, password, displayName }
   */
  register: async (userData) => {
    console.log('[useAuthStore.register] Registering user:', userData.email);
    set({ isLoading: true, error: null });
    
    try {
      // Create mock user with provided registration data
      const mockUser = {
        ...currentMockUser,
        username: userData.username || userData.email.split('@')[0],
        displayName: userData.displayName || userData.username,
        email: userData.email,
      };

      // Generate mock token
      const token = generateMockToken(mockUser);

      // Persist session (localStorage)
      persistSession(token, mockUser);

      // Close auth modal and update store
      try {
        useUIStore.getState().closeAuthModal();
      } catch (e) {
        console.warn('[useAuthStore.register] Could not close auth modal:', e);
      }

      set({
        user: mockUser,
        token: token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      console.log('[useAuthStore.register] Registration successful');
      return mockUser;
    } catch (error) {
      const message = error.message || 'Registration failed';
      console.error('[useAuthStore.register] Error:', message);
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  /**
   * Logout the current user
   * 
   * NOTE: Backend doesn't have /auth/logout endpoint
   * Just clearing local storage
   */
  logout: () => {
    console.log('[useAuthStore.logout] Logging out');
    clearSession();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
    
    // Try to call backend logout (will fail gracefully)
    authApi.logout().catch((error) => {
      console.warn('[useAuthStore.logout] Backend logout not available:', error.message);
    });
  },

  /**
   * Check if user has valid auth token
   * 
   * NOTE: Backend doesn't have /auth/me endpoint
   * Just checking localStorage
   */
  checkAuth: async () => {
    console.log('[useAuthStore.checkAuth] Checking authentication...');
    const token = get().token;
    
    if (!token) {
      console.log('[useAuthStore.checkAuth] No token found');
      set({ isLoading: false });
      return;
    }

    set({ isLoading: true });
    
    try {
      // Try to get user from backend (will fail)
      // Commented out since backend doesn't have this endpoint
      // const { data } = await authApi.getMe();
      
      // Instead, use stored user data
      const storedUser = getStoredUser();
      if (storedUser) {
        console.log('[useAuthStore.checkAuth] User authenticated from localStorage');
        set({ 
          user: storedUser, 
          isAuthenticated: true, 
          isLoading: false,
          error: null,
        });
        return;
      }

      // No stored user, clear session
      console.log('[useAuthStore.checkAuth] No stored user found, clearing session');
      clearSession();
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('[useAuthStore.checkAuth] Error:', error.message);
      
      // On error, check localStorage
      const storedUser = getStoredUser();
      if (storedUser) {
        set({ user: storedUser, isAuthenticated: true, isLoading: false });
      } else {
        clearSession();
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false, 
          isLoading: false,
          error: error.message,
        });
      }
    }
  },

  clearError: () => {
    console.log('[useAuthStore.clearError] Clearing error');
    set({ error: null });
  },
}));
