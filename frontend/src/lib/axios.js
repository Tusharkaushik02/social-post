/**
 * Axios Instance — Centralized HTTP Client
 *
 * All API calls flow through this single instance.
 * - Attaches auth token from useAuthStore on every request
 * - Handles 401 responses by triggering logout
 * - Configurable base URL from environment
 */
import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '@/config/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor ──────────────────────────────────────────
// Attaches Bearer token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ─────────────────────────────────────────
// Handles global error scenarios (401 unauthorized, network errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 — user's token is invalid or expired
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);

      // Dynamically import auth store to avoid circular dependencies.
      // We clear user state and open the auth modal so the user can re-login.
      import('@/stores/useAuthStore').then(({ useAuthStore }) => {
        const { logout } = useAuthStore.getState();
        logout();
        import('@/stores/useUIStore').then(({ useUIStore }) => {
          useUIStore.getState().openAuthModal('login');
        });
      });
    }

    error.message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.';

    return Promise.reject(error);
  }
);

export default api;
