/**
 * Application Constants
 * Centralized configuration values — no magic strings in components.
 */

// ── API Configuration ────────────────────────────────────────────
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// ── App Metadata ─────────────────────────────────────────────────
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Social Post';
export const APP_DESCRIPTION =
  import.meta.env.VITE_APP_DESCRIPTION ||
  'A modern social media platform';

// ── Pagination ───────────────────────────────────────────────────
export const POSTS_PER_PAGE = 10;
export const COMMENTS_PER_PAGE = 20;

// ── Media ────────────────────────────────────────────────────────
export const MAX_IMAGE_SIZE_MB = 10;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// ── Caption ──────────────────────────────────────────────────────
export const MAX_CAPTION_LENGTH = 2200;

// ── Breakpoints (match Tailwind defaults) ────────────────────────
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

// ── Local Storage Keys ───────────────────────────────────────────
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'social_post_token',
  AUTH_USER: 'social_post_user',
  THEME: 'social_post_theme',
};

// ── Feature Flags ────────────────────────────────────────────────
export const FEATURES = {
  DARK_MODE: true,
  COMMENTS: true,
  SAVED_POSTS: true,
  USER_PROFILES: true,
};
