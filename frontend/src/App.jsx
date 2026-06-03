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
            background: '#ffffff',
            color: '#1a1c1f',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: "'Inter', system-ui, sans-serif",
            border: '0.5px solid rgba(207, 196, 197, 0.3)',
            padding: '12px 16px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
          },
          success: {
            iconTheme: {
              primary: '#059669',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ba1a1a',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </ErrorBoundary>
  );
}
