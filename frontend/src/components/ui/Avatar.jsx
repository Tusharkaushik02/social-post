import { useState, useMemo } from 'react';
import { getAvatarPlaceholder } from '@/lib/utils';
import { cn } from '@/lib/cn';
import styles from './Avatar.module.css';

const SIZE_MAP = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
}

const GRADIENT_PAIRS = [
  ['#5b5ceb', '#818cf8'],
  ['#22c55e', '#06b6d4'],
  ['#f59e0b', '#f97316'],
  ['#f43f5e', '#ec4899'],
  ['#3b82f6', '#6366f1'],
  ['#14b8a6', '#22c55e'],
];

/**
 * Avatar — Circular user image with gradient fallback.
 *
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} size
 * @param {boolean} hasStory - Ring indicator (legacy social pattern)
 */
export default function Avatar({
  src,
  alt = 'User avatar',
  size = 'md',
  fallbackName = 'User',
  hasStory = false,
  className = '',
  style = {},
  ...props
}) {
  const [imgError, setImgError] = useState(false);
  const pixelSize = SIZE_MAP[size] || SIZE_MAP.md;
  const imgSrc = imgError || !src ? getAvatarPlaceholder(fallbackName, pixelSize) : src;

  const fallbackGradient = useMemo(() => {
    const idx = hashString(fallbackName) % GRADIENT_PAIRS.length;
    const [from, to] = GRADIENT_PAIRS[idx];
    return `linear-gradient(to bottom right, ${from}, ${to})`;
  }, [fallbackName]);

  const ringSpacing = hasStory ? 4 : 0;
  const outerSize = pixelSize + ringSpacing * 2;

  const fallbackBg = (imgError || !src) ? fallbackGradient : undefined;

  return (
    <div
      className={cn(
        styles.avatar,
        hasStory && styles.hasStory,
        className
      )}
      style={{ width: outerSize, height: outerSize, ...style }}
      {...props}
    >
      <div
        className={cn(
          styles.inner,
          hasStory && styles.hasStoryInner
        )}
        style={fallbackBg ? { background: fallbackBg } : undefined}
      >
        <img
          src={imgSrc}
          alt={alt}
          width={pixelSize}
          height={pixelSize}
          className={styles.image}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </div>
    </div>
  );
}

/**
 * AvatarGroup — Overlapping avatar stack.
 */
export function AvatarGroup({ children, className = '', ...props }) {
  return (
    <div className={cn(styles.group, className)} {...props}>
      {children}
    </div>
  );
}
