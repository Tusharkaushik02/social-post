/**
 * Users API
 * Handles user-related HTTP requests.
 *
 * Backend endpoints:
 * - GET  /users/:username       → Get user public profile
 * - GET  /users/:username/posts → Get posts by user
 * - PUT  /users/profile/update  → Update own profile (auth required)
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

  /**
   * @deprecated Not implemented in backend — placeholder for future
   * Follow a user.
   * @param {string} userId
   */
  follow: (userId) => {
    console.warn(`[usersApi.follow] Not yet implemented. User ID: ${userId}`);
    return Promise.resolve({ data: { success: true } });
  },

  /**
   * @deprecated Not implemented in backend — placeholder for future
   * Unfollow a user.
   * @param {string} userId
   */
  unfollow: (userId) => {
    console.warn(`[usersApi.unfollow] Not yet implemented. User ID: ${userId}`);
    return Promise.resolve({ data: { success: true } });
  },
};
