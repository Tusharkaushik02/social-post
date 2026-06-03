/**
 * Users API
 * Handles user-related HTTP requests.
 * 
 * IMPORTANT: These endpoints are NOT YET IMPLEMENTED in the backend.
 * The backend does not have any user endpoints.
 */
import api from '@/lib/axios';

export const usersApi = {
  /**
   * @deprecated Not implemented in backend
   * Fetch a user profile by username.
   * @param {string} username - Username
   */
  getProfile: (username) => {
    console.warn(`[usersApi.getProfile] Not implemented in backend. Username: ${username}`);
    return Promise.reject(new Error('Endpoint not implemented: GET /users/:username'));
  },

  /**
   * @deprecated Not implemented in backend
   * Update the current user's profile.
   * @param {FormData|object} data - Profile data (may include avatar file)
   */
  updateProfile: (data) => {
    console.warn('[usersApi.updateProfile] Not implemented in backend');
    return Promise.reject(new Error('Endpoint not implemented: PATCH /users/me'));
  },

  /**
   * @deprecated Not implemented in backend
   * Follow a user.
   * @param {string} userId - User ID to follow
   */
  follow: (userId) => {
    console.warn(`[usersApi.follow] Not implemented in backend. User ID: ${userId}`);
    return Promise.reject(new Error('Endpoint not implemented: POST /users/:userId/follow'));
  },

  /**
   * @deprecated Not implemented in backend
   * Unfollow a user.
   * @param {string} userId - User ID to unfollow
   */
  unfollow: (userId) => {
    console.warn(`[usersApi.unfollow] Not implemented in backend. User ID: ${userId}`);
    return Promise.reject(new Error('Endpoint not implemented: DELETE /users/:userId/follow'));
  },

  /**
   * @deprecated Not implemented in backend
   * Get followers of a user.
   * @param {string} username - Username
   * @param {number} page - Page number
   */
  getFollowers: (username, page = 1) => {
    console.warn(`[usersApi.getFollowers] Not implemented in backend. Username: ${username}`);
    return Promise.reject(new Error('Endpoint not implemented: GET /users/:username/followers'));
  },

  /**
   * @deprecated Not implemented in backend
   * Get users that a user is following.
   * @param {string} username - Username
   * @param {number} page - Page number
   */
  getFollowing: (username, page = 1) => {
    console.warn(`[usersApi.getFollowing] Not implemented in backend. Username: ${username}`);
    return Promise.reject(new Error('Endpoint not implemented: GET /users/:username/following'));
  },
};
