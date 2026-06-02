/**
 * Users API
 * Handles user-related HTTP requests.
 */
import api from '@/lib/axios';

export const usersApi = {
  /**
   * Fetch a user profile by username.
   * @param {string} username - Username
   */
  getProfile: (username) => api.get(`/users/${username}`),

  /**
   * Update the current user's profile.
   * @param {FormData|object} data - Profile data (may include avatar file)
   */
  updateProfile: (data) => {
    const isFormData = data instanceof FormData;
    return api.patch('/users/me', data, {
      headers: isFormData
        ? { 'Content-Type': 'multipart/form-data' }
        : undefined,
    });
  },

  /**
   * Follow a user.
   * @param {string} userId - User ID to follow
   */
  follow: (userId) => api.post(`/users/${userId}/follow`),

  /**
   * Unfollow a user.
   * @param {string} userId - User ID to unfollow
   */
  unfollow: (userId) => api.delete(`/users/${userId}/follow`),

  /**
   * Get followers of a user.
   * @param {string} username - Username
   * @param {number} page - Page number
   */
  getFollowers: (username, page = 1) =>
    api.get(`/users/${username}/followers`, { params: { page } }),

  /**
   * Get users that a user is following.
   * @param {string} username - Username
   * @param {number} page - Page number
   */
  getFollowing: (username, page = 1) =>
    api.get(`/users/${username}/following`, { params: { page } }),

  /**
   * Search for users by query string.
   * @param {string} query - Search query
   * @param {number} limit - Max results
   */
  search: (query, limit = 10) =>
    api.get('/users/search', { params: { q: query, limit } }),

  /**
   * Get suggested users to follow.
   * @param {number} limit - Max suggestions
   */
  getSuggestions: (limit = 5) =>
    api.get('/users/suggestions', { params: { limit } }),
};
