/**
 * Theme Store — Zustand
 *
 * Manages light/dark mode preference.
 * Persists selection to localStorage and syncs with the DOM
 * by toggling the `.dark` class on <html>.
 */
import { create } from 'zustand';
import { STORAGE_KEYS } from '@/config/constants';

/**
 * Determine the resolved theme based on user preference and system setting.
 * @param {'system'|'light'|'dark'} preference
 * @returns {'light'|'dark'}
 */
function resolveTheme(preference) {
  if (preference === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return preference;
}

/**
 * Apply the resolved theme to the DOM.
 * Adds/removes `.dark` class on <html> element.
 * @param {'light'|'dark'} resolvedTheme
 */
function applyThemeToDOM(resolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle('light', resolvedTheme === 'light');
  root.classList.toggle('dark', resolvedTheme === 'dark');
}

// Read initial preference from storage
const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
const initialResolved = resolveTheme(storedTheme);

// Apply on load
applyThemeToDOM(initialResolved);

export const useThemeStore = create((set, get) => ({
  // ── State ────────────────────────────────────────────────────
  theme: storedTheme,               // 'system' | 'light' | 'dark'
  resolvedTheme: initialResolved,   // 'light' | 'dark' (computed)

  // ── Actions ──────────────────────────────────────────────────

  /**
   * Set the theme preference explicitly.
   * @param {'system'|'light'|'dark'} theme
   */
  setTheme: (theme) => {
    const resolved = resolveTheme(theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    applyThemeToDOM(resolved);
    set({ theme, resolvedTheme: resolved });
  },

  /**
   * Cycle through themes: light → dark → system → light...
   */
  toggleTheme: () => {
    const current = get().theme;
    const next =
      current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
    get().setTheme(next);
  },

  /**
   * Re-evaluate the resolved theme (called when system preference changes).
   */
  syncWithSystem: () => {
    const { theme } = get();
    if (theme === 'system') {
      const resolved = resolveTheme('system');
      applyThemeToDOM(resolved);
      set({ resolvedTheme: resolved });
    }
  },
}));

// ── System preference listener ───────────────────────────────────
// Reacts to OS-level dark mode changes when theme is set to 'system'
if (typeof window !== 'undefined') {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      useThemeStore.getState().syncWithSystem();
    });
}
