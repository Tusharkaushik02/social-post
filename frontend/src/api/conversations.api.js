import api from '@/lib/axios';

export const conversationsApi = {
  getConversations: (page = 1, limit = 20) => api.get('/conversations', { params: { page, limit } }),
  createConversation: (participantId) => api.post('/conversations', { participantId }),
  getMessages: (conversationId, cursor = null, limit = 50) => api.get(`/conversations/${conversationId}/messages`, { params: { cursor, limit } }),
};
