import { useState } from 'react';
import type { Theme } from '../lib/theme';
import { effectiveTheme, getStoredTheme, setTheme as persist } from '../lib/theme';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme());
  const isDark = effectiveTheme(theme) === 'dark';

  const set = (t: Theme) => {
    persist(t);
    setThemeState(t);
  };
  const toggle = () => set(isDark ? 'light' : 'dark');

  return { theme, isDark, toggle, set };
}
