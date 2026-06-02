/**
 * Utility Functions
 * Generic helpers used throughout the application.
 */

/**
 * Conditionally join CSS class names together.
 * Filters out falsy values (null, undefined, false, '').
 * @param  {...string} classes - Class names to join
 * @returns {string} Joined class string
 *
 * @example
 * cn('btn', isActive && 'btn-active', isDisabled && 'btn-disabled')
 * // → 'btn btn-active' (if isActive=true, isDisabled=false)
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format a date to a relative time string (e.g., "2h ago", "3d ago").
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date) {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 4) return `${diffWeek}w ago`;

  return past.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a number to a compact display string (e.g., 1200 → "1.2K").
 * @param {number} num - Number to format
 * @returns {string} Compact string
 */
export function formatCount(num) {
  if (num < 1000) return String(num);
  if (num < 1_000_000) return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
}

/**
 * Truncate a string to a maximum length with ellipsis.
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
export function truncate(str, maxLength = 150) {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Debounce a function call.
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay = 300) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Generate a placeholder avatar URL from a username.
 * Uses UI Avatars service for consistent placeholder generation.
 * @param {string} name - User display name
 * @param {number} size - Avatar size in pixels
 * @returns {string} Avatar URL
 */
export function getAvatarPlaceholder(name, size = 80) {
  const encoded = encodeURIComponent(name || 'User');
  return `https://ui-avatars.com/api/?name=${encoded}&size=${size}&background=random&bold=true`;
}
