import { Link } from 'react-router-dom';

const cardBase = 'rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-800 dark:shadow-black/30';

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
      className={`${cardBase} transition hover:shadow-md focus-visible:ring-4 focus-visible:ring-sky-200 dark:focus-visible:ring-sky-500/40 focus-visible:outline-none ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
