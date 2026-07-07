import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
import { conversationsApi } from '@/api/conversations.api';
import { messagesApi } from '@/api/messages.api';
import { dmSocketService } from '@/api/socket.service';
import { useUnreadStore } from './useUnreadStore';

export const useMessageStore = create((set, get) => ({
  conversations: [],
  selectedConversationId: null,
  messages: {},
  isLoadingConversations: false,
  isLoadingMessages: false,
  error: null,
  hasMoreMessages: {},

  fetchConversations: async () => {
    set({ isLoadingConversations: true, error: null });
    try {
      const res = await conversationsApi.getConversations();
      const conversations = res.data.conversations;
      
      set({ conversations, isLoadingConversations: false });
      
      const unreadStore = useUnreadStore.getState();
      conversations.forEach(c => {
          if (c.unreadCount > 0) {
              unreadStore.setUnreadCount(c._id, c.unreadCount);
          }
      });
      
    } catch (error) {
      set({ isLoadingConversations: false, error: error.message });
    }
  },

  fetchMessages: async (conversationId) => {
    set({ isLoadingMessages: true, error: null });
    try {
      const res = await conversationsApi.getMessages(conversationId);
      
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: res.data.messages || [],
        },
        hasMoreMessages: {
          ...state.hasMoreMessages,
          [conversationId]: res.data.hasMore
        },
        isLoadingMessages: false,
      }));
    } catch (error) {
      set({ isLoadingMessages: false, error: error.message });
    }
  },

  selectConversation: (conversationId) => {
    set({ selectedConversationId: conversationId });
  },

  createConversation: async (participantId) => {
    try {
      const res = await conversationsApi.createConversation(participantId);
      const conversation = res.data.conversation;
      
      set((state) => {
          const exists = state.conversations.some(c => c._id === conversation._id);
          if (!exists) {
              return { conversations: [conversation, ...state.conversations] };
          }
          return state;
      });
      return conversation;
    } catch (error) {
      console.error('Failed to create conversation', error);
      throw error;
    }
  },

  sendMessage: async (conversationId, content, type = 'text') => {
    const currentUserId = useAuthStore.getState().user?._id;
    if (!currentUserId) {
      throw new Error('You must be logged in to send messages');
    }

    const clientMessageId = `temp_${Date.now()}`;
    const tempMessage = {
      _id: clientMessageId,
      conversationId,
      sender: currentUserId,
      content,
      type,
      status: 'sending',
      createdAt: new Date().toISOString(),
      clientMessageId
    };

    set((state) => {
      const convMessages = state.messages[conversationId] || [];
      const updatedConversations = state.conversations.map(conv => {
        if (conv._id === conversationId) {
          return {
            ...conv,
            lastMessage: { content, sender: currentUserId, createdAt: tempMessage.createdAt },
            updatedAt: tempMessage.createdAt
          };
        }
        return conv;
      });
      updatedConversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      return {
        messages: {
          ...state.messages,
          [conversationId]: [...convMessages, tempMessage],
        },
        conversations: updatedConversations
      };
    });

    try {
      const res = await messagesApi.sendMessage(conversationId, content, clientMessageId);
      const realMessage = res.data.message;
      
      dmSocketService.sendMessage(conversationId, content, clientMessageId);

      set((state) => {
        const convMessages = state.messages[conversationId] || [];
        return {
          messages: {
            ...state.messages,
            [conversationId]: convMessages.map(msg =>
              msg.clientMessageId === clientMessageId || msg._id === clientMessageId ? { ...realMessage, status: 'sent' } : msg
            ),
          },
        };
      });
    } catch (error) {
       get().updateMessageStatus(conversationId, clientMessageId, 'failed');
    }
  },

  addIncomingMessage: (conversationId, message) => {
    set((state) => {
      const convMessages = state.messages[conversationId] || [];
      if (convMessages.some(m => m._id === message._id || (m.clientMessageId && m.clientMessageId === message.clientMessageId))) {
          return state;
      }
      
      const updatedConversations = state.conversations.map(conv => {
        if (conv._id === conversationId) {
          return {
            ...conv,
            lastMessage: { content: message.content, sender: message.sender, createdAt: message.createdAt },
            updatedAt: message.createdAt
          };
        }
        return conv;
      });
      updatedConversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      return {
        messages: {
          ...state.messages,
          [conversationId]: [...convMessages, message],
        },
        conversations: updatedConversations
      };
    });
  },

  updateMessageStatus: (conversationId, messageId, status) => {
    set((state) => {
      const convMessages = state.messages[conversationId] || [];
      return {
        messages: {
          ...state.messages,
          [conversationId]: convMessages.map(msg =>
            msg._id === messageId || msg.clientMessageId === messageId ? { ...msg, status } : msg
          ),
        },
      };
    });
  },

  updateMessagesReadStatus: (conversationId, messageIds, userId) => {
      set((state) => {
          const convMessages = state.messages[conversationId] || [];
          return {
              messages: {
                  ...state.messages,
                  [conversationId]: convMessages.map(msg => 
                      messageIds.includes(msg._id) ? { ...msg, status: 'read', readBy: [...(msg.readBy || []), userId] } : msg
                  )
              }
          };
      });
  },

  clearMessages: (conversationId) => {
    set((state) => {
      const nextMessages = { ...state.messages };
      delete nextMessages[conversationId];
      return { messages: nextMessages };
    });
  },
}));
