import { cn } from '@/lib/cn';
import styles from './Tag.module.css';

/**
 * Tag — Topic or filter chip.
 *
 * @param {'default'|'primary'|'accent'|'outline'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} selected - Active/selected state
 */
export default function Tag({
  children,
  variant = 'default',
  size = 'md',
  selected = false,
  className = '',
  ...props
}) {
  return (
    <span
      className={cn(
        styles.tag,
        selected && styles.selected,
        !selected && (styles[variant] ?? styles.default),
        styles[size] ?? styles.md,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/**
 * TagButton — Interactive tag (filter pill).
 */
export function TagButton({
  children,
  variant = 'default',
  size = 'md',
  selected = false,
  className = '',
  ...props
}) {
  return (
    <button
      type="button"
      className={cn(
        styles.tag,
        styles.interactive,
        selected && styles.selected,
        !selected && (styles[variant] ?? styles.default),
        styles[size] ?? styles.md,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
