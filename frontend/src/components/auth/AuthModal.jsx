import { AnimatePresence, motion } from 'framer-motion';
import Modal from '@/components/ui/Modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { APP_NAME } from '@/config/constants';
import { useAuth } from '@/hooks/useAuth';

import { IoCloseOutline } from 'react-icons/io5';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalView, switchAuthView } = useAuth();
  const isLogin = authModalView === 'login';

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      size="sm"
      className="max-w-[440px] p-0 overflow-hidden"
    >
      <div className="relative flex flex-col bg-surface-container-lowest">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container-high transition-colors text-on-surface-variant active:scale-95"
          aria-label="Close modal"
        >
          <IoCloseOutline size={20} />
        </button>

        {/* Gradient Header Banner */}
        <div className="h-32 bg-gradient-to-br from-surface-container-lowest to-surface-container-low flex items-center justify-center relative overflow-hidden shrink-0 border-b-[0.5px] border-outline-variant/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[30px] translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-[20px] -translate-x-1/2 translate-y-1/2"></div>
          <h1 className="text-headline-lg font-headline-lg text-primary z-10 tracking-tight">SocialPost</h1>
        </div>

        {/* Content Area */}
        <div className="p-8 pt-6 flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-headline-md font-headline-md text-primary mb-1">
              {isLogin ? 'Welcome back' : 'Join SocialPost'}
            </h2>
            <p className="text-body-md text-on-surface-variant">
              {isLogin ? 'Sign in to see what\'s happening.' : 'Create your profile and start sharing.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={authModalView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
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
