import { create } from 'zustand';
import { useThemeStore } from './useThemeStore';

export const useUIStore = create((set) => ({
  authModal: {
    isOpen: false,
    view: 'login',
  },
  createPostModal: {
    isOpen: false,
  },

  openAuthModal: (view = 'login') =>
    set({ authModal: { isOpen: true, view } }),
  closeAuthModal: () =>
    set((state) => ({
      authModal: { ...state.authModal, isOpen: false },
    })),
  switchAuthView: (view) =>
    set((state) => ({
      authModal: { ...state.authModal, view },
    })),

  openCreatePostModal: () =>
    set({ createPostModal: { isOpen: true } }),
  closeCreatePostModal: () =>
    set({ createPostModal: { isOpen: false } }),

  setTheme: (theme) => useThemeStore.getState().setTheme(theme),
  toggleTheme: () => useThemeStore.getState().toggleTheme(),
}));
