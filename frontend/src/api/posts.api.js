/**
 * Posts API
 * Handles post-related HTTP requests.
 * 
 * Backend Endpoints Available:
 * - GET /api/posts → Returns array of posts
 * - POST /api/posts/create → Create post with image and caption
 * - GET /api/posts/:id → Get post by ID
 * - DELETE /api/posts/:id → Delete post
 */
import api from '@/lib/axios';

export const postsApi = {
  /**
   * Fetch all posts (backend returns flat array, ignores pagination params)
   * 
   * @param {number} page - IGNORED by backend (kept for frontend compatibility)
   * @param {number} limit - IGNORED by backend (kept for frontend compatibility)
   * @returns {Promise} Response with posts array
   */
  getAll: (page = 1, limit = 10) => {
    console.log(`[postsApi.getAll] Fetching posts from backend`);
    return api.get('/posts', { params: { page, limit } });
  },

  /**
   * Create a new post with image upload.
   * 
   * Backend expects:
   * - FormData with 'image' field (file) and 'caption' field (string)
   * - Responds with { success: true, post: {...} }
   * 
   * @param {FormData} formData - Form data containing caption and image file
   * @returns {Promise} Response with created post
   */
  create: (formData) => {
    console.log('[postsApi.create] Creating post with FormData');
    return api.post('/posts/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Get post by ID
   * @param {string} id - Post ID
   * @returns {Promise} Response with post data
   */
  getById: (id) => {
    console.log(`[postsApi.getById] Fetching post: ${id}`);
    return api.get(`/posts/${id}`);
  },

  /**
   * Delete post
   * @param {string} id - Post ID
   * @returns {Promise} Response confirmation
   */
  delete: (id) => {
    console.log(`[postsApi.delete] Deleting post: ${id}`);
    return api.delete(`/posts/${id}`);
  },

  /**
   * Toggle like on a post (same endpoint for like and unlike)
   * POST /api/posts/:id/like
   * @param {string} id - Post ID
   * @returns {Promise} Response with updated post
   */
  like: (id) => {
    console.log(`[postsApi.like] Toggling like on post: ${id}`);
    return api.post(`/posts/${id}/like`);
  },

  /**
   * Alias for like (same endpoint, toggle behavior)
   * @param {string} id - Post ID
   * @returns {Promise} Response with updated post
   */
  unlike: (id) => {
    console.log(`[postsApi.unlike] Toggling unlike on post: ${id}`);
    return api.post(`/posts/${id}/like`);
  },

  /**
   * @deprecated Not implemented in backend
   */
  save: (postId) => {
    console.warn(`[postsApi.save] Not implemented in backend. Post ID: ${postId}`);
    return Promise.reject(new Error('Endpoint not implemented: POST /posts/:postId/save'));
  },

  /**
   * @deprecated Not implemented in backend
   */
  unsave: (postId) => {
    console.warn(`[postsApi.unsave] Not implemented in backend. Post ID: ${postId}`);
    return Promise.reject(new Error('Endpoint not implemented: DELETE /posts/:postId/save'));
  },

  /**
   * @deprecated Not implemented in backend
   */
  getSaved: (page = 1) => {
    console.warn('[postsApi.getSaved] Not implemented in backend');
    return Promise.reject(new Error('Endpoint not implemented: GET /posts/saved'));
  },
};
