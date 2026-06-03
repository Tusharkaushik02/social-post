import { useState, useMemo } from 'react';
import { getAvatarPlaceholder } from '@/lib/utils';

const SIZE_MAP = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

/**
 * Hash a string to a number (simple djb2).
 * Used to pick a consistent gradient for fallback avatars.
 */
function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
}

const GRADIENT_PAIRS = [
  ['#8b5cf6', '#d946ef'],  // violet -> fuchsia
  ['#10b981', '#06b6d4'],  // emerald -> cyan
  ['#f59e0b', '#f97316'],  // amber -> orange
  ['#f43f5e', '#ec4899'],  // rose -> pink
  ['#3b82f6', '#6366f1'],  // blue -> indigo
  ['#14b8a6', '#22c55e'],  // teal -> green
];

/**
 * Avatar — Atomic UI Component
 *
 * Circular avatar image matching premium light design system.
 * Uses a hash-based gradient for the fallback background.
 *
 * @param {object} props
 * @param {string} props.src - Image URL
 * @param {string} props.alt - Alt text
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} props.size
 * @param {string} props.fallbackName - Name for placeholder avatar generation
 * @param {boolean} props.hasStory - Show story ring indicator
 */
export default function Avatar({
  src,
  alt = 'User avatar',
  size = 'md',
  fallbackName = 'User',
  hasStory = false,
  className = '',
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

  // Outer container size accounts for ring spacing
  const ringSpacing = hasStory ? 4 : 0;
  const outerSize = pixelSize + ringSpacing * 2;

  const fallbackBg = (imgError || !src) ? fallbackGradient : undefined;

  return (
    <div
      className={`avatar${hasStory ? ' has-story' : ''} ${className}`.trim()}
      style={{ width: outerSize, height: outerSize }}
      {...props}
    >
      <div
        className="avatar-image"
        style={fallbackBg ? { background: fallbackBg } : undefined}
      >
        <img
          src={imgSrc}
          alt={alt}
          width={pixelSize}
          height={pixelSize}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </div>
    </div>
  );
}
