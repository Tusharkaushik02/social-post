/**
 * Route Path Constants
 *
 * Centralized route definitions — prevents magic strings scattered
 * across components. Import ROUTES wherever you need to reference
 * a route path (Link `to`, navigate(), etc.).
 */

export const ROUTES = {
  HOME: '/',
  EXPLORE: '/explore',
  PROFILE: '/profile/:username',
  SAVED: '/saved',
  SETTINGS: '/settings',
  LOGIN: '/login',
  SIGNUP: '/signup',
};

/**
 * Generate a dynamic route path by replacing params.
 *
 * @param {string} route - Route template (e.g., '/profile/:username')
 * @param {Record<string, string>} params - Param values to substitute
 * @returns {string} Resolved path (e.g., '/profile/johndoe')
 *
 * @example
 * buildPath(ROUTES.PROFILE, { username: 'johndoe' })
 * // → '/profile/johndoe'
 */
export function buildPath(route, params = {}) {
  let path = route;
  for (const [key, value] of Object.entries(params)) {
    path = path.replace(`:${key}`, encodeURIComponent(value));
  }
  return path;
}
