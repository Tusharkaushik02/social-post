import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

import styles from './Button.module.css';

/**
 * Button — Design system button primitive.
 *
 * @param {'primary'|'secondary'|'accent'|'danger'|'ghost'} variant
 * @param {'sm'|'md'|'lg'} size
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      disabled={disabled || isLoading}
      className={cn(
        styles.button,
        styles[variant] ?? styles.primary,
        styles[size] ?? styles.md,
        fullWidth && styles.fullWidth,
        className
      )}
      {...props}
    >
      {isLoading ? (
        <svg
          className={styles.spinner}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
        </svg>
      ) : (
        leftIcon && <span className={styles.icon}>{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className={styles.icon}>{rightIcon}</span>}
    </motion.button>
  );
}
