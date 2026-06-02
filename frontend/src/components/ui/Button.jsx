import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  const baseClasses =
    'inline-flex items-center justify-center rounded-sm font-semibold transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 select-none';

  const variantClasses = {
    primary:
      'bg-primary text-on-primary hover:opacity-90',
    secondary:
      'border border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high',
    danger:
      'bg-error text-on-error hover:opacity-90',
    ghost:
      'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface',
  };

  const sizeClasses = {
    sm: 'h-9 px-3.5 text-label-sm gap-1.5',
    md: 'h-10 px-4 text-label-md gap-2',
    lg: 'h-12 px-6 text-body-md gap-2.5',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      disabled={disabled || isLoading}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <svg
          className="h-4 w-4 animate-spin text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
        </svg>
      ) : (
        leftIcon && <span className="flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex shrink-0">{rightIcon}</span>}
    </motion.button>
  );
}
