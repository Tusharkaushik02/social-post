import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { IoCloseOutline } from 'react-icons/io5';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

export default function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  className = '',
}) {
  const isMobile = useMediaQuery('(max-width: 639px)');

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'sm:max-w-[430px]',
    md: 'sm:max-w-[520px]',
    lg: 'sm:max-w-[720px]',
  };

  const mobileVariants = {
    initial: { y: '100%' },
    animate: { y: 0, transition: { type: 'spring', damping: 32, stiffness: 320 } },
    exit: { y: '100%', transition: { type: 'spring', damping: 32, stiffness: 360 } },
  };

  const desktopVariants = {
    initial: { scale: 0.96, opacity: 0, y: 14 },
    animate: { scale: 1, opacity: 1, y: 0, transition: { type: 'spring', damping: 24, stiffness: 280 } },
    exit: { scale: 0.96, opacity: 0, y: 14, transition: { duration: 0.16 } },
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-5">
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-[40px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            variants={isMobile ? mobileVariants : desktopVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
              'z-10 flex flex-col overflow-hidden border-[0.5px] border-outline-variant/30 bg-surface-container-lowest text-on-surface shadow-elevated',
              'max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:max-h-[88vh] max-sm:w-full max-sm:rounded-t-xl',
              'sm:w-full sm:rounded-xl',
              sizeClasses[size],
              className
            )}
          >
            {isMobile && (
              <div className="flex shrink-0 justify-center py-3">
                <div className="h-1 w-10 rounded-full bg-surface-container-highest" />
              </div>
            )}

            {title && (
              <div className="flex shrink-0 items-center justify-between border-b-[0.5px] border-outline-variant/30 px-5 py-4">
                <h2 id="modal-title" className="truncate text-headline-md font-headline-md text-primary">
                  {title}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
                  aria-label="Close modal"
                >
                  <IoCloseOutline size={22} />
                </button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-5 py-5 max-sm:pb-8">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
