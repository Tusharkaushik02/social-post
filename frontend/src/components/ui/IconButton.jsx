import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * IconButton — Atomic UI Component
 *
 * A button that renders only an icon with consistent hit target sizing.
 * Used for post actions (like, comment, share, save).
 *
 * @param {object} props
 * @param {React.ReactNode} props.icon - Icon element to render
 * @param {string} props.label - Accessible aria-label (required)
 * @param {'sm'|'md'|'lg'} props.size
 * @param {boolean} props.isActive - Active/toggled state (e.g., liked)
 * @param {string} props.activeClassName - Classes applied when isActive=true
 */
export default function IconButton({
  icon,
  label,
  size = 'md',
  isActive = false,
  activeClassName = '',
  className = '',
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 select-none';

  const sizeClasses = {
    sm: 'w-8 h-8 text-[18px]',
    md: 'w-10 h-10 text-[22px]',
    lg: 'w-12 h-12 text-[26px]',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      aria-label={label}
      title={label}
      className={cn(
        baseClasses,
        sizeClasses[size],
        isActive ? cn('text-primary', activeClassName) : '',
        className
      )}
      {...props}
    >
      <span className={cn('flex items-center justify-center transition-transform', isActive && 'scale-110')}>
        {icon}
      </span>
    </motion.button>
  );
}
