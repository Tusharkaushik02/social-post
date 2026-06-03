import { motion } from 'framer-motion';

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
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
  }[variant] || 'btn-primary';

  const sizeClass = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  }[size] || 'btn-md';

  const classes = `btn ${variantClass} ${sizeClass}${fullWidth ? ' btn-full' : ''} ${className}`.trim();

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      disabled={disabled || isLoading}
      className={classes}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin"
          style={{ height: 16, width: 16, color: 'currentColor' }}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
        </svg>
      ) : (
        leftIcon && <span style={{ display: 'flex', flexShrink: 0 }}>{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span style={{ display: 'flex', flexShrink: 0 }}>{rightIcon}</span>}
    </motion.button>
  );
}
