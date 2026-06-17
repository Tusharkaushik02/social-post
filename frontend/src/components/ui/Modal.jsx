import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { IoCloseOutline } from 'react-icons/io5';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';
import styles from './Modal.module.css';

const sizeClasses = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

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
        <div
          className={cn(
            styles.overlay,
            !isMobile && styles.overlayDesktop
          )}
        >
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
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
              styles.modal,
              isMobile ? styles.modalMobile : (sizeClasses[size] ?? sizeClasses.md),
              className
            )}
          >
            {isMobile && (
              <div className={styles.dragHandleContainer}>
                <div className={styles.dragHandle} />
              </div>
            )}

            {title && (
              <div className={styles.header}>
                <h2 id="modal-title" className={styles.title}>
                  {title}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className={styles.closeButton}
                  aria-label="Close modal"
                >
                  <IoCloseOutline size={20} />
                </button>
              </div>
            )}

            <div className={cn(styles.content, isMobile && styles.contentMobile)}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
