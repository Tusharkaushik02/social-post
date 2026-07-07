import { create } from 'zustand';

export const useUnreadStore = create((set, get) => ({
  unreadCounts: {}, 

  setUnreadCount: (conversationId, count) => {
    set((state) => ({
      unreadCounts: { ...state.unreadCounts, [conversationId]: count },
    }));
  },

  incrementUnread: (conversationId) => {
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [conversationId]: (state.unreadCounts[conversationId] || 0) + 1,
      },
    }));
  },

  clearUnread: (conversationId) => {
    set((state) => {
      const next = { ...state.unreadCounts };
      delete next[conversationId];
      return { unreadCounts: next };
    });
  },

  getTotalUnread: () => {
    const counts = get().unreadCounts;
    return Object.values(counts).reduce((sum, count) => sum + count, 0);
  },
}));
