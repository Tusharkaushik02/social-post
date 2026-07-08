/**
 * Router Configuration
 *
 * Defines all application routes using React Router v7's
 * createBrowserRouter. Routes are wrapped with the AppLayout
 * which provides the persistent navbar and content structure.
 *
 * Route types:
 * - Public: Accessible to all users (feed, explore, profiles)
 * - Protected: Requires authentication (saved posts, settings)
 * - Auth: Login/signup pages (no app layout wrapper)
 */
/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from './routes';
import ProtectedRoute from './ProtectedRoute';

// Layout
import AppLayout from '@/components/layout/AppLayout';

// Pages (lazy-loaded for code splitting)
const HomePage = lazy(() => import('@/pages/HomePage'));
const ExplorePage = lazy(() => import('@/pages/ExplorePage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const SavedPage = lazy(() => import('@/pages/SavedPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const MessagesLayout = lazy(() => import('@/pages/MessagesLayout'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));

function RouteLoader() {
  return (
    <div className="mx-auto w-full max-w-[640px] px-4 py-6 md:px-6">
      <div className="h-24 animate-shimmer rounded-sm bg-surface-container" />
    </div>
  );
}

function withSuspense(element) {
  return <Suspense fallback={<RouteLoader />}>{element}</Suspense>;
}

const router = createBrowserRouter([
  // ── Auth Pages (no AppLayout wrapper) ───────────────────────────
  {
    path: ROUTES.LOGIN,
    element: withSuspense(<LoginPage />),
  },
  {
    path: ROUTES.SIGNUP,
    element: withSuspense(<SignupPage />),
  },

  // ── Main App (with AppLayout) ──────────────────────────────────
  {
    element: <AppLayout />,
    children: [
      // ── Public Routes ────────────────────────────────────────
      {
        path: ROUTES.HOME,
        element: withSuspense(<HomePage />),
      },
      {
        path: ROUTES.EXPLORE,
        element: withSuspense(<ExplorePage />),
      },
      {
        path: ROUTES.PROFILE,
        element: withSuspense(<ProfilePage />),
      },

      // ── Protected Routes ─────────────────────────────────────
      {
        path: ROUTES.SAVED,
        element: (
          <ProtectedRoute>
            {withSuspense(<SavedPage />)}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.SETTINGS,
        element: (
          <ProtectedRoute>
            {withSuspense(<SettingsPage />)}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.MESSAGES,
        element: (
          <ProtectedRoute>
            {withSuspense(<MessagesLayout />)}
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.MESSAGES_CONVERSATION,
        element: (
          <ProtectedRoute>
            {withSuspense(<MessagesLayout />)}
          </ProtectedRoute>
        ),
      },

      // ── Catch-all ────────────────────────────────────────────
      {
        path: '*',
        element: withSuspense(<NotFoundPage />),
      },
    ],
  },
]);

export default router;
