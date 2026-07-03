import { Link } from 'react-router-dom';

const base =
  'inline-flex items-center justify-center gap-2 rounded-2xl font-bold transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 dark:focus-visible:ring-sky-500/40 disabled:opacity-50 disabled:pointer-events-none';

const variants = {
  primary: 'bg-sky-500 text-white hover:bg-sky-600 shadow-md shadow-sky-500/20',
  success: 'bg-green-500 text-white hover:bg-green-600 shadow-md shadow-green-500/20',
  accent: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20',
  warning: 'bg-amber-500 text-white hover:bg-amber-600 shadow-md shadow-amber-500/20',
  secondary:
    'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600',
  ghost: 'text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700',
};

const sizes = {
  sm: 'px-4 py-2 text-base',
  md: 'px-6 py-3 text-xl',
  lg: 'w-full py-4 text-2xl',
};

export function Button({
  as,
  to,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  const cls = `${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`;
  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  const Tag = as || 'button';
  return (
    <Tag className={cls} {...rest}>
      {children}
    </Tag>
  );
}
