import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { useUIStore } from '@/stores/useUIStore';

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const openAuthModal = useUIStore((s) => s.openAuthModal);
  const location = useLocation();

  if (isLoading) return null;

  if (!isAuthenticated) {
    window.setTimeout(() => openAuthModal('login'), 0);
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
