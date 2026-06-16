/**
 * Users API
 * Handles user-related HTTP requests.
 *
 * Backend endpoints:
 * - GET  /users/:username       → Get user public profile
 * - GET  /users/:username/posts → Get posts by user
 * - PUT  /users/profile/update  → Update own profile (auth required)
 * - POST /users/:userId/follow  → Toggle follow state (auth required)
 */
import api from '@/lib/axios';

export const usersApi = {
  /**
   * Fetch a user profile by username.
   * @param {string} username
   * @returns {Promise} Response with user data
   */
  getProfile: (username) => api.get(`/users/${username}`),

  /**
   * Fetch posts by a specific user.
   * @param {string} username
   * @returns {Promise} Response with posts array
   */
  getUserPosts: (username) => api.get(`/users/${username}/posts`),

  /**
   * Update the current user's profile.
   * @param {{ displayname?: string, bio?: string, avatarUrl?: string }} data
   * @returns {Promise} Response with updated user data
   */
  updateProfile: (data) => api.put('/users/profile/update', data),

  follow: (userId) => api.post(`/users/${userId}/follow`),

  unfollow: (userId) => api.post(`/users/${userId}/follow`),

  getFollowers: (userId) => api.get(`/users/${userId}/followers`),

  getFollowing: (userId) => api.get(`/users/${userId}/following`),

  getSuggestions: (limit = 4) => api.get('/users/suggestions', { params: { limit } }),
};
