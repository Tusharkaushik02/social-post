import { cn } from '@/lib/cn';
import styles from './Skeleton.module.css';

/**
 * Skeleton — Loading placeholder with shimmer animation.
 *
 * @param {'text'|'circular'|'rectangular'} variant
 */
export default function Skeleton({
  variant = 'rectangular',
  width,
  height,
  className = '',
  ...props
}) {
  return (
    <div
      className={cn(
        styles.shimmer,
        styles[variant] ?? styles.rectangular,
        className
      )}
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

/**
 * SkeletonText — Multi-line text skeleton.
 */
export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={cn(styles.skeletonText, className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '65%' : '100%'}
          height={14}
        />
      ))}
    </div>
  );
}

/**
 * SkeletonCard — Card-shaped loading placeholder.
 */
export function SkeletonCard({ className = '' }) {
  return (
    <div className={cn(styles.skeletonCard, className)}>
      <div className={styles.skeletonCardHeader}>
        <Skeleton variant="circular" width={40} height={40} />
        <div className={styles.skeletonCardLines}>
          <Skeleton variant="text" width="40%" height={14} />
          <SkeletonText lines={2} />
        </div>
      </div>
      <Skeleton
        variant="rectangular"
        className={cn(styles.skeletonCardImage, "mt-4")}
        style={{ aspectRatio: '16/9' }}
      />
    </div>
  );
}
