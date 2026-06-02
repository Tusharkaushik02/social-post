import { useAuthStore } from '@/stores/useAuthStore';
import { useUIStore } from '@/stores/useUIStore';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);

  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const logout = useAuthStore((s) => s.logout);
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const clearError = useAuthStore((s) => s.clearError);

  const authModal = useUIStore((s) => s.authModal);
  const openAuthModal = useUIStore((s) => s.openAuthModal);
  const closeAuthModal = useUIStore((s) => s.closeAuthModal);
  const switchAuthView = useUIStore((s) => s.switchAuthView);

  const requireAuth = (callback) => {
    return (...args) => {
      if (!isAuthenticated) {
        openAuthModal('login');
        return undefined;
      }
      return callback?.(...args);
    };
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    isAuthModalOpen: authModal.isOpen,
    authModalView: authModal.view,
    login,
    register,
    logout,
    checkAuth,
    openAuthModal,
    closeAuthModal,
    switchAuthView,
    clearError,
    requireAuth,
  };
}
