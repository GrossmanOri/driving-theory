// Theme: 'system' follows the browser, 'light'/'dark' are manual overrides.
export type Theme = 'light' | 'dark' | 'system';

const KEY = 'driving-theory-theme';
const mq = () => window.matchMedia('(prefers-color-scheme: dark)');

export function getStoredTheme(): Theme {
  return (localStorage.getItem(KEY) as Theme) || 'system';
}

export function effectiveTheme(theme: Theme): 'light' | 'dark' {
  return theme === 'system' ? (mq().matches ? 'dark' : 'light') : theme;
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', effectiveTheme(theme) === 'dark');
}

export function setTheme(theme: Theme) {
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
