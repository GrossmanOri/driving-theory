import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProgressContext } from '../hooks/useProgressContext';
import { useAuth } from '../hooks/useAuth';
import { levelInfo } from '../lib/levels';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './Button';
import { Logo } from './Logo';
import { IconArrowRight, IconLogOut, IconStar } from './Icons';

export function TopBar() {
  const { progress, totalStars } = useProgressContext();
  const { signOut } = useAuth();
  const location = useLocation();
  const showBack = location.pathname !== '/';
  const level = levelInfo(progress.points);

  // Pulse the points chip whenever the total goes up (dopamine feedback).
  const prevPoints = useRef(progress.points);
  const [pointsPulse, setPointsPulse] = useState(false);
  useEffect(() => {
    if (progress.points > prevPoints.current) {
      setPointsPulse(true);
      const t = setTimeout(() => setPointsPulse(false), 600);
      prevPoints.current = progress.points;
      return () => clearTimeout(t);
    }
    prevPoints.current = progress.points;
  }, [progress.points]);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-2">
        {showBack ? (
          <Button to="/" variant="ghost" size="sm" aria-label="בית">
            {/* RTL: "back" points right */}
            <IconArrowRight size={20} />
            <span className="hidden sm:inline">בית</span>
          </Button>
        ) : (
          <Link to="/" aria-label="לומדים תיאוריה">
            <Logo size={32} />
          </Link>
        )}
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600"
          title={level.rank.name}
        >
          {level.rank.icon} <span className="hidden sm:inline">{level.rank.name}</span>
        </Link>
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-slate-600 dark:border-slate-700 dark:text-slate-300">
          <IconStar size={16} fill="currentColor" className="text-amber-400" /> {totalStars}
        </span>
        <span
          className={`hidden items-center rounded-full border border-slate-200 px-3 py-1 text-slate-600 sm:inline-flex dark:border-slate-700 dark:text-slate-300${
            pointsPulse ? ' animate-chip-pulse' : ''
          }`}
        >
          {progress.points} נק׳
        </span>
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
