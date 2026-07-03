import { useTheme } from '../hooks/useTheme';

export function ThemeToggle({ className = '' }) {
  const { isDark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      title={isDark ? 'מצב בהיר' : 'מצב כהה'}
      aria-label={isDark ? 'מעבר למצב בהיר' : 'מעבר למצב כהה'}
      className={`rounded-full p-2 text-xl transition hover:bg-slate-100 dark:hover:bg-slate-700 ${className}`}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
