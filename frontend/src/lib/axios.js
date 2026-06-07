/**
 * Axios Instance — Centralized HTTP Client
 *
 * All API calls flow through this single instance.
 * - Attaches auth token from useAuthStore on every request
 * - Handles 401 responses by triggering logout
 * - Configurable base URL from environment
 * - Comprehensive request/response logging
 */
import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '@/config/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor ──────────────────────────────────────────
// Attaches Bearer token to every outgoing request + detailed logging
api.interceptors.request.use(
  (config) => {
    // Cookies are sent automatically via withCredentials — no manual token handling
    console.log('[API Request]', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullUrl: `${config.baseURL}${config.url}`,
      params: config.params,
      timestamp: new Date().toISOString(),
    });
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// ── Response Interceptor ─────────────────────────────────────────
// Handles global error scenarios (401 unauthorized, network errors) + logging
api.interceptors.response.use(
  (response) => {
    // Detailed response logging
    console.log('[API Response]', {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      dataPreview: typeof response.data === 'object' 
        ? JSON.stringify(response.data).substring(0, 200) 
        : response.data,
      timestamp: new Date().toISOString(),
    });
    return response;
  },
  (error) => {
    // Detailed error logging
    const errorInfo = {
      message: error.message,
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      timestamp: new Date().toISOString(),
    };
    
    console.error('[API Error Response]', errorInfo);

    // Handle 401 — user's session is invalid or expired
    if (error.response?.status === 401) {
      console.warn('[API] Unauthorized (401) — session expired');

      // Defer store imports to avoid circular dependencies during render
      Promise.resolve().then(() => {
        import('@/stores/useAuthStore').then(({ useAuthStore }) => {
          try {
            useAuthStore.getState().clearSession();
          } catch (e) {
            console.error('[API] Error clearing session:', e);
          }
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
