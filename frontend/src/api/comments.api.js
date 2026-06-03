/**
 * Comments API
 * Handles comment-related HTTP requests.
 * 
 * IMPORTANT: These endpoints are NOT YET IMPLEMENTED in the backend.
 * The backend does not have any comment endpoints.
 */
import api from '@/lib/axios';

export const commentsApi = {
  /**
   * @deprecated Not implemented in backend
   * Fetch comments for a specific post.
   * @param {string} postId - Post ID
   * @param {number} page - Page number
   * @param {number} limit - Comments per page
   */
  getByPost: (postId, page = 1, limit = 20) => {
    console.warn(`[commentsApi.getByPost] Not implemented in backend. Post ID: ${postId}`);
    return Promise.reject(new Error('Endpoint not implemented: GET /posts/:postId/comments'));
  },

  /**
   * @deprecated Not implemented in backend
   * Create a new comment on a post.
   * @param {string} postId - Post ID
   * @param {{ text: string }} data - Comment data
   */
  create: (postId, data) => {
    console.warn(`[commentsApi.create] Not implemented in backend. Post ID: ${postId}`);
    return Promise.reject(new Error('Endpoint not implemented: POST /posts/:postId/comments'));
  },

  /**
   * @deprecated Not implemented in backend
   * Delete a comment.
   * @param {string} postId - Post ID
   * @param {string} commentId - Comment ID
   */
  delete: (postId, commentId) => {
    console.warn(`[commentsApi.delete] Not implemented in backend. Post ID: ${postId}, Comment ID: ${commentId}`);
    return Promise.reject(new Error('Endpoint not implemented: DELETE /posts/:postId/comments/:commentId'));
  },

  /**
   * @deprecated Not implemented in backend
   * Like a comment.
   * @param {string} commentId - Comment ID
   */
  like: (commentId) => {
    console.warn(`[commentsApi.like] Not implemented in backend. Comment ID: ${commentId}`);
    return Promise.reject(new Error('Endpoint not implemented: POST /comments/:commentId/like'));
  },

  /**
   * @deprecated Not implemented in backend
   * Unlike a comment.
   * @param {string} commentId - Comment ID
   */
  unlike: (commentId) => {
    console.warn(`[commentsApi.unlike] Not implemented in backend. Comment ID: ${commentId}`);
    return Promise.reject(new Error('Endpoint not implemented: DELETE /comments/:commentId/like'));
  },
};
