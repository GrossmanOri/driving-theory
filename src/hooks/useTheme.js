import { useState } from 'react';
import { effectiveTheme, getStoredTheme, setTheme as persist } from '../lib/theme';

export function useTheme() {
  const [theme, setThemeState] = useState(getStoredTheme());
  const isDark = effectiveTheme(theme) === 'dark';

  const set = (t) => {
    persist(t);
    setThemeState(t);
  };
  const toggle = () => set(isDark ? 'light' : 'dark');

  return { theme, isDark, toggle, set };
}
