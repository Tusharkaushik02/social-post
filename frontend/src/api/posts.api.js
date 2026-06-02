/**
 * Posts API
 * Handles post-related HTTP requests.
 */
import api from '@/lib/axios';

export const postsApi = {
  /**
   * Fetch paginated feed of posts.
   * @param {number} page - Page number
   * @param {number} limit - Posts per page
   */
  getAll: (page = 1, limit = 10) =>
    api.get('/posts', { params: { page, limit } }),

  /**
   * Fetch a single post by ID.
   * @param {string} id - Post ID
   */
  getById: (id) => api.get(`/posts/${id}`),

  /**
   * Fetch posts by a specific user.
   * @param {string} username - Username
   * @param {number} page - Page number
   */
  getByUser: (username, page = 1) =>
    api.get(`/posts/user/${username}`, { params: { page } }),

  /**
   * Create a new post with image upload.
   * @param {FormData} formData - Form data containing caption and image file
   */
  create: (formData) =>
    api.post('/create-post', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  /**
   * Delete a post.
   * @param {string} id - Post ID
   */
  delete: (id) => api.delete(`/posts/${id}`),

  /**
   * Like a post.
   * @param {string} id - Post ID
   */
  like: (id) => api.post(`/posts/${id}/like`),

  /**
   * Unlike a post.
   * @param {string} id - Post ID
   */
  unlike: (id) => api.delete(`/posts/${id}/like`),

  /**
   * Save a post to bookmarks.
   * @param {string} id - Post ID
   */
  save: (id) => api.post(`/posts/${id}/save`),

  /**
   * Remove a post from bookmarks.
   * @param {string} id - Post ID
   */
  unsave: (id) => api.delete(`/posts/${id}/save`),

  /**
   * Fetch the current user's saved posts.
   * @param {number} page - Page number
   */
  getSaved: (page = 1) =>
    api.get('/posts/saved', { params: { page } }),
};
