import api from '@/lib/axios';

export const messagesApi = {
  sendMessage: (conversationId, content, clientMessageId) => api.post('/messages', { conversationId, content, clientMessageId }),
  markAsRead: (conversationId) => api.patch(`/messages/${conversationId}/read`),
};
