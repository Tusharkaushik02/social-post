import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Modal from '@/components/ui/Modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { APP_NAME } from '@/config/constants';
import { useAuth } from '@/hooks/useAuth';

import { IoCloseOutline } from 'react-icons/io5';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalView, switchAuthView, isAuthenticated } = useAuth();
  const isLogin = authModalView === 'login';

  useEffect(() => {
    if (isAuthenticated && isAuthModalOpen) {
      closeAuthModal();
    }
  }, [isAuthenticated, isAuthModalOpen, closeAuthModal]);

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      size="sm"
      className="auth-modal-panel"
      style={{ padding: 0 }}
    >
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="auth-close-btn"
          aria-label="Close modal"
        >
          <IoCloseOutline size={20} />
        </button>

        {/* Gradient Header Banner */}
        <div className="auth-header">
          {/* Decorative glow orbs */}
          <div className="auth-header-orb-1" />
          <div className="auth-header-orb-2" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, zIndex: 10 }}>
            {/* App icon */}
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg style={{ width: 20, height: 20, color: 'var(--color-on-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <h1 className="auth-header-title">{APP_NAME}</h1>
          </div>
        </div>

        {/* Content Area */}
        <div className="auth-content">
          <div style={{ textAlign: 'center' }}>
            <h2 className="auth-welcome-title">
              {isLogin ? 'Welcome back' : `Join ${APP_NAME}`}
            </h2>
            <p className="auth-welcome-subtitle">
              {isLogin ? "Sign in to see what's happening." : 'Create your profile and start sharing.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={authModalView}
              initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              {isLogin ? (
                <LoginForm onSwitchToRegister={() => switchAuthView('register')} />
              ) : (
                <RegisterForm onSwitchToLogin={() => switchAuthView('login')} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Modal>
  );
}
