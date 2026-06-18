import { Link, useLocation } from 'react-router-dom';
import { useProgressContext } from '../hooks/ProgressContext';

export function TopBar() {
  const { progress, totalStars } = useProgressContext();
  const location = useLocation();
  const showBack = location.pathname !== '/';

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
      <div className="flex items-center gap-2">
        {showBack ? (
          <Link to="/" className="rounded-full px-3 py-1 text-lg text-slate-500 hover:bg-slate-100">
            ← בית
          </Link>
        ) : (
          <span className="text-xl font-extrabold text-sky-600">לומדים תיאוריה 🚗</span>
        )}
      </div>
      <div className="flex items-center gap-3 text-lg font-bold">
        <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-600">⭐ {totalStars}</span>
        <span className="rounded-full bg-green-50 px-3 py-1 text-green-600">{progress.points} נק׳</span>
      </div>
    </header>
  );
}
