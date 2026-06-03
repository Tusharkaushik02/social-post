import { motion } from 'framer-motion';

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
  const sizeStyles = {
    sm: { width: 36, height: 36, fontSize: 18 },
    md: { width: 40, height: 40, fontSize: 22 },
    lg: { width: 48, height: 48, fontSize: 26 },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  const activeClass = isActive ? activeClassName : '';

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      aria-label={label}
      title={label}
      className={`${activeClass} ${className}`.trim()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-full)',
        color: isActive ? 'var(--color-secondary)' : 'var(--color-on-surface-variant)',
        transition: 'all 0.2s ease-in-out',
        userSelect: 'none',
        ...currentSize,
      }}
      {...props}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s',
          transform: isActive ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        {icon}
      </span>
    </motion.button>
  );
}
