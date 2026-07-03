import { useTheme } from '../hooks/useTheme';
import { IconSun, IconMoon } from './Icons';

export function ThemeToggle({ className = '' }) {
  const { isDark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      title={isDark ? 'מצב בהיר' : 'מצב כהה'}
      aria-label={isDark ? 'מעבר למצב בהיר' : 'מעבר למצב כהה'}
      className={`rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700 ${className}`}
    >
      {isDark ? <IconSun size={22} /> : <IconMoon size={22} />}
    </button>
  );
}
