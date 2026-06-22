import { Link, useLocation } from 'react-router-dom';
import { useProgressContext } from '../hooks/ProgressContext';
import { useAuth } from '../hooks/AuthContext';
import { levelInfo } from '../lib/levels';
import { ThemeToggle } from './ThemeToggle';

export function TopBar() {
  const { progress, totalStars } = useProgressContext();
  const { signOut } = useAuth();
  const location = useLocation();
  const showBack = location.pathname !== '/';
  const level = levelInfo(progress.points);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-white/90 px-4 py-3 shadow-sm backdrop-blur dark:bg-slate-800/90 dark:shadow-black/30">
      <div className="flex items-center gap-2">
        {showBack ? (
          <Link to="/" className="rounded-full px-3 py-1 text-lg text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
            ← בית
          </Link>
        ) : (
          <span className="text-xl font-extrabold text-sky-600 dark:text-sky-400">לומדים תיאוריה 🚗</span>
        )}
      </div>
      <div className="flex items-center gap-2 text-lg font-bold">
        <Link
          to="/dashboard"
          className="rounded-full bg-sky-50 px-3 py-1 text-base text-sky-700 hover:bg-sky-100 dark:bg-sky-500/15 dark:text-sky-300"
          title={level.rank.name}
        >
          {level.rank.icon} {level.rank.name}
        </Link>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">⭐ {totalStars}</span>
        <span className="rounded-full bg-green-50 px-3 py-1 text-green-600 dark:bg-green-500/15 dark:text-green-300">{progress.points} נק׳</span>
        <ThemeToggle />
        <button
          onClick={signOut}
          className="rounded-full px-2 py-1 text-base text-slate-400 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
          title="התנתקות"
        >
          יציאה
        </button>
      </div>
    </header>
  );
}
