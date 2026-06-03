import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { IoCloseOutline } from 'react-icons/io5';
import { useMediaQuery } from '@/hooks/useMediaQuery';

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

  const sizeClass = {
    sm: 'modal-sm',
    md: 'modal-md',
    lg: 'modal-lg',
  }[size] || 'modal-md';

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
        <div className="modal-overlay">
          {/* Backdrop */}
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            variants={isMobile ? mobileVariants : desktopVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`modal-panel ${sizeClass} ${className}`.trim()}
          >
            {/* Mobile drag handle */}
            {isMobile && (
              <div className="modal-drag-handle">
                <div className="modal-drag-handle-bar" />
              </div>
            )}

            {/* Header */}
            {title && (
              <div className="modal-header">
                <h2 id="modal-title" className="modal-title">
                  {title}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="modal-close-btn"
                  aria-label="Close modal"
                >
                  <IoCloseOutline size={20} />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="modal-body">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
