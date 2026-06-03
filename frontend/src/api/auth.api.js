/**
 * Auth API
 * Handles authentication-related HTTP requests.
 * 
 * IMPORTANT: These endpoints are NOT YET IMPLEMENTED in the backend.
 * The backend does not have:
 * - POST /auth/register
 * - POST /auth/login
 * - POST /auth/logout
 * - GET /auth/me
 * - POST /auth/refresh
 * 
 * Authentication is currently handled via localStorage (client-side mock).
 * See useAuthStore.js for implementation details.
 */
import api from '@/lib/axios';

export const authApi = {
  /**
   * @deprecated Not implemented in backend
   * Register a new user account.
   * @param {{ username: string, email: string, password: string, displayName: string }} data
   */
  register: (data) => {
    console.warn('[authApi.register] Not implemented in backend');
    return Promise.reject(new Error('Endpoint not implemented: POST /auth/register'));
  },

  /**
   * @deprecated Not implemented in backend
   * Log in with existing credentials.
   * @param {{ email: string, password: string }} credentials
   */
  login: (credentials) => {
    console.warn('[authApi.login] Not implemented in backend');
    return Promise.reject(new Error('Endpoint not implemented: POST /auth/login'));
  },

  /**
   * @deprecated Not implemented in backend
   * Log out the current user (server-side session invalidation).
   */
  logout: () => {
    console.warn('[authApi.logout] Not implemented in backend');
    return Promise.reject(new Error('Endpoint not implemented: POST /auth/logout'));
  },

  /**
   * @deprecated Not implemented in backend
   * Get the currently authenticated user's profile.
   */
  getMe: () => {
    console.warn('[authApi.getMe] Not implemented in backend');
    return Promise.reject(new Error('Endpoint not implemented: GET /auth/me'));
  },

  /**
   * @deprecated Not implemented in backend
   * Refresh the access token using a refresh token.
   * @param {{ refreshToken: string }} data
   */
  refreshToken: (data) => {
    console.warn('[authApi.refreshToken] Not implemented in backend');
    return Promise.reject(new Error('Endpoint not implemented: POST /auth/refresh'));
  },
};

