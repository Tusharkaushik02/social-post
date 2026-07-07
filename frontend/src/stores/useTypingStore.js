import { create } from 'zustand';

export const useTypingStore = create((set, get) => ({
  typingUsers: {},

  setTyping: (conversationId, user) => {
    // TODO: Will be triggered by socket event 'user:typing'
    set((state) => {
      const current = state.typingUsers[conversationId] || [];
      const filtered = current.filter((u) => u.userId !== user.userId);
      return {
        typingUsers: {
          ...state.typingUsers,
          [conversationId]: [...filtered, { ...user, timestamp: Date.now() }],
        },
      };
    });
  },

  clearTyping: (conversationId, userId) => {
    set((state) => {
      const current = state.typingUsers[conversationId] || [];
      return {
        typingUsers: {
          ...state.typingUsers,
          [conversationId]: current.filter((u) => u.userId !== userId),
        },
      };
    });
  },

  clearAllTyping: (conversationId) => {
    set((state) => ({
      typingUsers: { ...state.typingUsers, [conversationId]: [] },
    }));
  },

  getTypingUsers: (conversationId) => {
    return get().typingUsers[conversationId] || [];
  },
}));
