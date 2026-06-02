/**
 * Comments API
 * Handles comment-related HTTP requests.
 */
import api from '@/lib/axios';

export const commentsApi = {
  /**
   * Fetch comments for a specific post.
   * @param {string} postId - Post ID
   * @param {number} page - Page number
   * @param {number} limit - Comments per page
   */
  getByPost: (postId, page = 1, limit = 20) =>
    api.get(`/posts/${postId}/comments`, { params: { page, limit } }),

  /**
   * Create a new comment on a post.
   * @param {string} postId - Post ID
   * @param {{ text: string }} data - Comment data
   */
  create: (postId, data) =>
    api.post(`/posts/${postId}/comments`, data),

  /**
   * Delete a comment.
   * @param {string} postId - Post ID
   * @param {string} commentId - Comment ID
   */
  delete: (postId, commentId) =>
    api.delete(`/posts/${postId}/comments/${commentId}`),

  /**
   * Like a comment.
   * @param {string} commentId - Comment ID
   */
  like: (commentId) => api.post(`/comments/${commentId}/like`),

  /**
   * Unlike a comment.
   * @param {string} commentId - Comment ID
   */
  unlike: (commentId) => api.delete(`/comments/${commentId}/like`),
};
