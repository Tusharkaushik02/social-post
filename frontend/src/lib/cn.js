/**
 * Simple class names utility to replace tailwind-merge during the transition.
 * Concatenates strings and filters out falsy values.
 */
export function cn(...inputs) {
  return inputs.flat(Infinity).filter(Boolean).join(' ');
}
