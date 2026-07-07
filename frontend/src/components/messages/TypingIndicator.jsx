import { motion, AnimatePresence } from 'framer-motion';

export default function TypingIndicator({ users }) {
  if (!users || users.length === 0) return null;

  const getTypingText = () => {
    if (users.length === 1) return `${users[0].username} is typing...`;
    if (users.length === 2) return `${users[0].username} and ${users[1].username} are typing...`;
    return 'Multiple people are typing...';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
        }}
      >
        <div style={{ display: 'flex', gap: '4px' }}>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="typing-dot"
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
            />
          ))}
        </div>
        <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
          {getTypingText()}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
