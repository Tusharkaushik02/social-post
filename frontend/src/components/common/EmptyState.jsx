import { cn } from '@/lib/cn';
import styles from './EmptyState.module.css';
import { motion } from 'framer-motion';

/**
 * EmptyState — Centered placeholder for empty views.
 */
export default function EmptyState({
  title,
  description,
  icon,
  action,
  className = '',
  compact = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        styles.container,
        compact ? styles.compact : styles.normal,
        className
      )}
    >
      {icon && (
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className={styles.iconWrapper}
        >
          {icon}
        </motion.div>
      )}

      <h3 className={styles.title}>{title}</h3>

      {description && (
        <p className={styles.description}>
          {description}
        </p>
      )}

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={styles.action}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}
