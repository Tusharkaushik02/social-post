/**
 * App — Root Component
 *
 * Responsibilities:
 * - Provides RouterProvider with the app's route configuration
 * - Initializes auth check on mount
 * - Wraps app with ErrorBoundary
 * - Mounts Toaster for notifications
 */
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import router from '@/router';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useAuthStore } from '@/stores/useAuthStore';

export default function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  // Verify token validity on app mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--color-inverse-surface)',
            color: 'var(--color-inverse-on-surface)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '15px',
            fontFamily: 'var(--font-sans)',
          },
        }}
      />
    </ErrorBoundary>
  );
}
