// Theme: 'system' follows the browser, 'light'/'dark' are manual overrides.

const KEY = 'driving-theory-theme';
const mq = () => window.matchMedia('(prefers-color-scheme: dark)');

export function getStoredTheme() {
  return localStorage.getItem(KEY) || 'system';
}

export function effectiveTheme(theme) {
  return theme === 'system' ? (mq().matches ? 'dark' : 'light') : theme;
}

export function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', effectiveTheme(theme) === 'dark');
}

export function setTheme(theme) {
  localStorage.setItem(KEY, theme);
  applyTheme(theme);
}

/** Apply the stored theme and keep following the OS while in 'system' mode. */
export function initTheme() {
  applyTheme(getStoredTheme());
  mq().addEventListener('change', () => {
    if (getStoredTheme() === 'system') applyTheme('system');
  });
}
