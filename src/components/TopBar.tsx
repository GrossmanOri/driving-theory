import { Link, useLocation } from 'react-router-dom';
import { useProgressContext } from '../hooks/ProgressContext';
import { useAuth } from '../hooks/AuthContext';

export function TopBar() {
  const { progress, totalStars } = useProgressContext();
  const { signOut } = useAuth();
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
      <div className="flex items-center gap-2 text-lg font-bold">
        <Link to="/dashboard" className="rounded-full px-2 py-1 text-xl hover:bg-slate-100" title="הלוח שלי">
          📊
        </Link>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-600">⭐ {totalStars}</span>
        <span className="rounded-full bg-green-50 px-3 py-1 text-green-600">{progress.points} נק׳</span>
        <button
          onClick={signOut}
          className="rounded-full px-2 py-1 text-base text-slate-400 hover:bg-slate-100"
          title="התנתקות"
        >
          יציאה
        </button>
      </div>
    </header>
  );
}
