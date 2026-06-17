import { cn } from '@/lib/cn';
import styles from './Badge.module.css';

/**
 * Badge — Compact status or count label.
 *
 * @param {'default'|'primary'|'accent'|'success'|'warning'|'error'|'outline'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} pill - Fully rounded pill shape
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  pill = true,
  className = '',
  ...props
}) {
  return (
    <span
      className={cn(
        styles.badge,
        pill ? styles.pill : styles.rounded,
        styles[variant] ?? styles.default,
        styles[size] ?? styles.md,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
