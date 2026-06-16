import api from '@/lib/axios';

export const commentsApi = {
  getByPost: (postId) => api.get(`/posts/${postId}/comments`),
  create: (postId, data) => api.post(`/posts/${postId}/comments`, data),
  getReplies: (commentId) => api.get(`/comments/${commentId}/replies`),
  delete: (commentId) => api.delete(`/comments/${commentId}`),
};
