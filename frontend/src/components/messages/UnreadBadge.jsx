import { motion } from 'framer-motion';

export default function UnreadBadge({ count }) {
  if (!count) return null;

  const displayCount = count > 99 ? '99+' : count;

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '20px',
        height: '20px',
        padding: '0 6px',
        backgroundColor: 'var(--color-on-surface)',
        color: 'var(--color-surface)',
        borderRadius: '9999px',
        fontSize: '11px',
        fontWeight: 700,
        lineHeight: 1
      }}
    >
      {displayCount}
    </motion.span>
  );
}
