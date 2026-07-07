import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoImageOutline, IoDocumentOutline, IoMicOutline } from 'react-icons/io5';

export default function AttachmentMenu({ isOpen, onClose, onSelect }) {
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

  const menuItems = [
    { id: 'image', label: 'Image', icon: IoImageOutline },
    { id: 'file', label: 'File', icon: IoDocumentOutline },
    { id: 'gif', label: 'GIF', icon: () => <span style={{ fontSize: '12px', fontWeight: 700, padding: '0 2px' }}>GIF</span> },
    { id: 'voice', label: 'Voice Note', icon: IoMicOutline },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95, y: 10, transformOrigin: 'bottom left' }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            marginBottom: '12px',
            backgroundColor: 'var(--color-surface-container-lowest)',
            borderRadius: '12px',
            border: '1px solid rgba(207, 196, 197, 0.3)',
            boxShadow: 'var(--shadow-floating)',
            minWidth: '200px',
            overflow: 'hidden',
            zIndex: 50
          }}
        >
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelect(item.id);
                onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'transparent',
                transition: 'background-color 0.2s',
                textAlign: 'left',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-container-high)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <item.icon size={20} color="var(--color-on-surface-variant)" />
              <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-on-surface)' }}>
                {item.label}
              </span>
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
