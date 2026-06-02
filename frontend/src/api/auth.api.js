/**
 * Auth API
 * Handles authentication-related HTTP requests.
 */
import api from '@/lib/axios';

export const authApi = {
  /**
   * Register a new user account.
   * @param {{ username: string, email: string, password: string, displayName: string }} data
   */
  register: (data) => api.post('/auth/register', data),

  /**
   * Log in with existing credentials.
   * @param {{ email: string, password: string }} credentials
   */
  login: (credentials) => api.post('/auth/login', credentials),

  /**
   * Log out the current user (server-side session invalidation).
   */
  logout: () => api.post('/auth/logout'),

  /**
   * Get the currently authenticated user's profile.
   */
  getMe: () => api.get('/auth/me'),

  /**
   * Refresh the access token using a refresh token.
   * @param {{ refreshToken: string }} data
   */
  refreshToken: (data) => api.post('/auth/refresh', data),
};
