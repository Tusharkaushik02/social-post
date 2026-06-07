import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginForm from '@/components/auth/LoginForm';
import { useAuthStore } from '@/stores/useAuthStore';
import { APP_NAME } from '@/config/constants';
import { ROUTES } from '@/router/routes';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  // Redirect to home (or previous page) if already authenticated
  const from = location.state?.from?.pathname || '/';
  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated, navigate, from]);

  return (
    <div className="auth-page">
      {/* Background decorative elements */}
      <div className="auth-page-bg">
        <div className="auth-page-orb auth-page-orb-1" />
        <div className="auth-page-orb auth-page-orb-2" />
        <div className="auth-page-orb auth-page-orb-3" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="auth-page-card"
      >
        {/* Header */}
        <div className="auth-page-header">
          <div className="auth-page-logo">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <h1 className="auth-page-title">{APP_NAME}</h1>
        </div>

        {/* Welcome text */}
        <div style={{ textAlign: 'center' }}>
          <h2 className="auth-welcome-title">Welcome back</h2>
          <p className="auth-welcome-subtitle">Sign in to see what's happening.</p>
        </div>

        {/* Login form — pass navigation callback for the "Sign up" link */}
        <LoginForm
          onSwitchToRegister={() => navigate(ROUTES.SIGNUP)}
        />
      </motion.div>
    </div>
  );
}
