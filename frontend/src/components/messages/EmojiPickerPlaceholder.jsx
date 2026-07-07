import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoHappyOutline } from 'react-icons/io5';

export default function EmojiPickerPlaceholder({ isOpen, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.addEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute',
            bottom: '100%',
            right: 0,
            marginBottom: '12px',
            backgroundColor: 'var(--color-surface-container-lowest)',
            borderRadius: '12px',
            border: '1px solid rgba(207, 196, 197, 0.3)',
            boxShadow: 'var(--shadow-floating)',
            padding: '24px',
            textAlign: 'center',
            minWidth: '240px',
            zIndex: 50
          }}
        >
          <IoHappyOutline size={32} color="var(--color-on-surface-variant)" style={{ margin: '0 auto 12px auto' }} />
          <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-on-surface)', margin: 0 }}>
            Emoji picker coming soon
          </p>
          {/* TODO: Replace with emoji-mart or similar library */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
