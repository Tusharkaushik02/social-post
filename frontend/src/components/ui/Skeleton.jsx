import { cn } from '@/lib/utils';

/**
 * Skeleton — Atomic UI Component
 *
 * Loading placeholder with shimmer animation.
 * Used to show content shape while data is being fetched.
 *
 * @param {object} props
 * @param {'text'|'circular'|'rectangular'} props.variant
 * @param {string|number} props.width
 * @param {string|number} props.height
 * @param {string} props.className
 */
export default function Skeleton({
  variant = 'rectangular',
  width,
  height,
  className = '',
  ...props
}) {
  const baseClasses = 'animate-shimmer select-none pointer-events-none';
  
  const variantClasses = {
    text: 'rounded-xs bg-surface-container',
    circular: 'rounded-full bg-surface-container',
    rectangular: 'rounded-md bg-surface-container',
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={{
        width: width || '100%',
        height: height || (variant === 'text' ? '1em' : '100%'),
      }}
      role="status"
      aria-label="Loading placeholder"
      {...props}
    />
  );
}
