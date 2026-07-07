import { create } from 'zustand';

export const useOnlineStore = create((set, get) => ({
  onlineUserIds: new Set(), 

  setOnlineUsers: (userIds) => {
    set({ onlineUserIds: new Set(userIds) });
  },

  addOnlineUser: (userId) => {
    set((state) => {
      const next = new Set(state.onlineUserIds);
      next.add(userId);
      return { onlineUserIds: next };
    });
  },

  removeOnlineUser: (userId) => {
    set((state) => {
      const next = new Set(state.onlineUserIds);
      next.delete(userId);
      return { onlineUserIds: next };
    });
  },

  isOnline: (userId) => {
    return get().onlineUserIds.has(userId);
  },
}));
