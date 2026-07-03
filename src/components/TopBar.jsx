import { Link, useLocation } from 'react-router-dom';
import { useProgressContext } from '../hooks/useProgressContext';
import { useAuth } from '../hooks/useAuth';
import { levelInfo } from '../lib/levels';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './Button';
import { IconArrowRight, IconLogOut } from './Icons';

export function TopBar() {
  const { progress, totalStars } = useProgressContext();
  const { signOut } = useAuth();
  const location = useLocation();
  const showBack = location.pathname !== '/';
  const level = levelInfo(progress.points);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 bg-white/90 px-4 py-3 shadow-sm backdrop-blur dark:bg-slate-800/90 dark:shadow-black/30">
      <div className="flex items-center gap-2">
        {showBack ? (
          <Button to="/" variant="ghost" size="sm" aria-label="בית">
            {/* RTL: "back" points right */}
            <IconArrowRight size={20} />
            <span className="hidden sm:inline">בית</span>
          </Button>
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
          {level.rank.icon} <span className="hidden sm:inline">{level.rank.name}</span>
        </Link>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">⭐ {totalStars}</span>
        <span className="hidden rounded-full bg-green-50 px-3 py-1 text-green-600 sm:inline-flex dark:bg-green-500/15 dark:text-green-300">{progress.points} נק׳</span>
        <ThemeToggle />
        <Button
          onClick={signOut}
          variant="ghost"
          size="sm"
          className="!px-2"
          aria-label="התנתקות"
          title="התנתקות"
        >
          <IconLogOut size={20} />
        </Button>
      </div>
    </header>
  );
}
