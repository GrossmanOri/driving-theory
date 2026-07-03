export function Stars({ count, max = 3, size = 'text-3xl' }) {
  return (
    <div className={`flex gap-1 ${size}`} aria-label={`${count} מתוך ${max} כוכבים`}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={i < count ? 'animate-star-pop' : 'opacity-30 grayscale'}
        >
          ⭐
        </span>
      ))}
    </div>
  );
}
