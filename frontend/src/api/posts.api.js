/**
 * Posts API
 * Handles post-related HTTP requests.
 * 
 * Backend Endpoints Available:
 * - GET /posts → Returns array of posts (no pagination)
 * - POST /create-post → Create post with image and caption
 * 
 * Note: Advanced features (delete, like, save, etc.) not yet implemented in backend
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
    console.log(`[postsApi.getAll] Fetching posts (pagination params ignored by backend)`);
    return api.get('/posts', { params: { page, limit } });
  },

  /**
   * Create a new post with image upload.
   * 
   * Backend expects:
   * - FormData with 'image' field (file) and 'caption' field (string)
   * - Responds with { message: string, post: {...} }
   * 
   * @param {FormData} formData - Form data containing caption and image file
   * @returns {Promise} Response with created post
   */
  create: (formData) => {
    console.log('[postsApi.create] Creating post with FormData');
    return api.post('/create-post', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // ─────────────────────────────────────────────────────────────
  // The following endpoints are NOT YET IMPLEMENTED in the backend
  // Kept here for reference and to prevent import errors
  // ─────────────────────────────────────────────────────────────

  /**
   * @deprecated Not implemented in backend
   */
  getById: (id) => {
    console.warn(`[postsApi.getById] Not implemented in backend. Post ID: ${id}`);
    return Promise.reject(new Error('Endpoint not implemented: GET /posts/:id'));
  },

  /**
   * @deprecated Not implemented in backend
   */
  getByUser: (username, page = 1) => {
    console.warn(`[postsApi.getByUser] Not implemented in backend. Username: ${username}`);
    return Promise.reject(new Error('Endpoint not implemented: GET /posts/user/:username'));
  },

  /**
   * @deprecated Not implemented in backend
   */
  delete: (id) => {
    console.warn(`[postsApi.delete] Not implemented in backend. Post ID: ${id}`);
    return Promise.reject(new Error('Endpoint not implemented: DELETE /posts/:id'));
  },

  /**
   * @deprecated Not implemented in backend
   */
  like: (id) => {
    console.warn(`[postsApi.like] Not implemented in backend. Post ID: ${id}`);
    return Promise.reject(new Error('Endpoint not implemented: POST /posts/:id/like'));
  },

  /**
   * @deprecated Not implemented in backend
   */
  unlike: (id) => {
    console.warn(`[postsApi.unlike] Not implemented in backend. Post ID: ${id}`);
    return Promise.reject(new Error('Endpoint not implemented: DELETE /posts/:id/like'));
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
