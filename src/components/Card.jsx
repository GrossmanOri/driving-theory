import { Link } from 'react-router-dom';

const cardBase =
  'rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800';

export function Card({ className = '', children, ...rest }) {
  return (
    <div className={`${cardBase} ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function CardLink({ to, className = '', children, ...rest }) {
  return (
    <Link
      to={to}
      className={`${cardBase} transition hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-slate-600 focus-visible:ring-4 focus-visible:ring-sky-200 dark:focus-visible:ring-sky-500/40 focus-visible:outline-none ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
