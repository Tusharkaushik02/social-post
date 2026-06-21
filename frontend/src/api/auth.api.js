/**
 * Auth API
 * Handles authentication-related HTTP requests.
 *
 * Backend endpoints:
 * - POST /auth/register  → Create account
 * - POST /auth/login     → Login (sets httpOnly cookie)
 * - GET  /auth/me        → Get current user from cookie
 * - POST /auth/logout    → Clear auth cookie
 */
import api from '@/lib/axios';

export const authApi = {
  /**
   * Register a new user account.
   * @param {{ username: string, email: string, password: string }} data
   * @returns {Promise} Response with user data + token cookie set
   */
  register: (data) => api.post('/auth/register', data),

  /**
   * Log in with existing credentials.
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise} Response with user data + token cookie set
   */
  login: (credentials) => api.post('/auth/login', credentials),

  /**
   * Log in with Google OAuth ID token.
   * @param {string} idToken
   * @returns {Promise} Response with user data + token cookie set
   */
  googleLogin: (idToken) => api.post('/auth/google', { idToken }),

  /**
   * Log out the current user (clears httpOnly cookie).
   * @returns {Promise} Response confirmation
   */
  logout: () => api.post('/auth/logout'),

  /**
   * Get the currently authenticated user's profile from the cookie.
   * @returns {Promise} Response with user data
   */
  getMe: () => api.get('/auth/me'),
};
