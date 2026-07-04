// Center-screen combo celebration. Purely decorative: never captures input
// (pointer-events-none), auto-dismiss is handled by the caller (~1.2s).
export function ComboToast({ text }) {
  if (!text) return null;
  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center"
      aria-hidden="true"
    >
      <div className="animate-bounce-in rounded-2xl bg-white/95 px-8 py-5 text-center text-3xl font-black text-slate-800 shadow-2xl ring-2 ring-amber-300 backdrop-blur-sm sm:text-4xl dark:bg-slate-800/95 dark:text-white dark:ring-amber-400">
        {text}
      </div>
    </div>
  );
}
