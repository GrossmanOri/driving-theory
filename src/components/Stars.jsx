import { IconStar } from './Icons';

// Map the legacy text-size prop to an icon pixel size so existing callers work.
const pxForSize = {
  'text-base': 18,
  'text-lg': 20,
  'text-xl': 24,
  'text-2xl': 28,
  'text-3xl': 32,
  'text-4xl': 40,
  'text-5xl': 48,
};

export function Stars({ count, max = 3, size = 'text-3xl' }) {
  const px = typeof size === 'number' ? size : pxForSize[size] || 32;
  return (
    <div className="flex gap-1" aria-label={`${count} מתוך ${max} כוכבים`}>
      {Array.from({ length: max }).map((_, i) =>
        i < count ? (
          <IconStar key={i} size={px} fill="currentColor" className="animate-star-pop text-amber-400" />
        ) : (
          <IconStar key={i} size={px} className="text-slate-300 dark:text-slate-600" />
        )
      )}
    </div>
  );
}
