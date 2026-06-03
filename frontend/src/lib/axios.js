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
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor ──────────────────────────────────────────
// Attaches Bearer token to every outgoing request + detailed logging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Detailed request logging
    const logInfo = {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullUrl: `${config.baseURL}${config.url}`,
      params: config.params,
      hasToken: !!token,
      timestamp: new Date().toISOString(),
    };
    
    if (config.data instanceof FormData) {
      logInfo.data = '[FormData]';
      // Log FormData entries for debugging
      const entries = [];
      for (let [key, value] of config.data.entries()) {
        if (value instanceof File) {
          entries.push(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          entries.push(`${key}: ${value}`);
        }
      }
      logInfo.formDataEntries = entries;
    } else {
      logInfo.data = config.data;
    }
    
    console.log('[API Request]', logInfo);
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

    // Handle 401 — user's token is invalid or expired
    if (error.response?.status === 401) {
      console.warn('[API] Unauthorized (401) - Clearing token and redirecting to login');
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);

      // Defer store imports to avoid circular dependencies during render
      Promise.resolve().then(() => {
        import('@/stores/useAuthStore').then(({ useAuthStore }) => {
          try {
            const { logout } = useAuthStore.getState();
            logout();
          } catch (e) {
            console.error('[API] Error calling logout:', e);
          }
        });
        
        import('@/stores/useUIStore').then(({ useUIStore }) => {
          try {
            useUIStore.getState().openAuthModal('login');
          } catch (e) {
            console.error('[API] Error opening auth modal:', e);
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
