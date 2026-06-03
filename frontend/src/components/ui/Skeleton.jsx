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
  const variantClass = {
    text: 'skeleton-text',
    circular: 'skeleton-circular',
    rectangular: 'skeleton-rect',
  }[variant] || 'skeleton-rect';

  return (
    <div
      className={`skeleton ${variantClass} animate-shimmer ${className}`.trim()}
      style={{
        width: width || '100%',
        height: height || (variant === 'text' ? '1em' : '100%'),
      }}
      role="status"
      aria-busy="true"
      aria-label="Loading placeholder"
      {...props}
    />
  );
}
