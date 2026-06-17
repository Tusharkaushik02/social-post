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
   * Fetch a page of posts.
   *
   * @param {number} page
   * @param {number} limit
   * @returns {Promise} Response with posts array and pagination metadata
   */
  getAll: (page = 1, limit = 10) => {
    console.log(`[postsApi.getAll] Fetching posts from backend`, { page, limit });
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
      timeout: 60000,
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
   * Toggle save/unsave a post (same endpoint — toggle behavior)
   * POST /api/posts/:id/save
   * @param {string} postId - Post ID
   * @returns {Promise} Response with { success, saved: boolean }
   */
  save: (postId) => {
    console.log(`[postsApi.save] Toggling save on post: ${postId}`);
    return api.post(`/posts/${postId}/save`);
  },

  /**
   * Alias for save (same toggle endpoint)
   * @param {string} postId - Post ID
   * @returns {Promise} Response with { success, saved: boolean }
   */
  unsave: (postId) => {
    console.log(`[postsApi.unsave] Toggling save on post: ${postId}`);
    return api.post(`/posts/${postId}/save`);
  },

  /**
   * Fetch saved posts for the current user.
   * GET /api/posts/saved
   * @param {number} page - Page number
   * @returns {Promise} Response with { success, posts, page, totalPages, hasMore }
   */
  getSaved: (page = 1) => {
    console.log(`[postsApi.getSaved] Fetching saved posts, page: ${page}`);
    return api.get('/posts/saved', { params: { page } });
  },
};
