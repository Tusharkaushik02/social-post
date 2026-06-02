import { useState } from 'react';
import { getAvatarPlaceholder, cn } from '@/lib/utils';

const SIZE_MAP = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

/**
 * Avatar — Atomic UI Component
 *
 * Circular avatar image matching Aura Social design system.
 * Avatars are strictly circular to contrast against the geometric feed grid.
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

  // Outer container size needs to account for the ring spacing if hasStory is true
  const ringSpacing = hasStory ? 4 : 0;
  const outerSize = pixelSize + ringSpacing * 2;

  return (
    <div
      className={cn(
        'relative flex items-center justify-center shrink-0 select-none rounded-full',
        hasStory && 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]',
        className
      )}
      style={{ width: outerSize, height: outerSize }}
      {...props}
    >
      <div
        className={cn(
          'w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-surface-container',
          hasStory && 'border-2 border-surface'
        )}
      >
        <img
          src={imgSrc}
          alt={alt}
          width={pixelSize}
          height={pixelSize}
          className="w-full h-full object-cover transition-opacity duration-300"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </div>
    </div>
  );
}
