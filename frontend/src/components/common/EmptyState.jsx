import { motion } from 'framer-motion';

export default function EmptyState({ title, description, icon, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="empty-state"
    >
      {icon && (
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="empty-state-icon"
        >
          {icon}
        </motion.div>
      )}

      <h3 className="empty-state-title">{title}</h3>

      {description && (
        <p className="empty-state-desc">
          {description}
        </p>
      )}

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginTop: '24px' }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}
