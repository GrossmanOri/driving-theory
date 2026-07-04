import { useMemo } from 'react';
import { getAllQuestions } from '../data/loader';
import { useProgressContext } from '../hooks/useProgressContext';
import { Card } from '../components/Card';
import { IconLock } from '../components/Icons';

export function Collection() {
  const { progress } = useProgressContext();

  // One sticker per unique sign image; collected if any question using it is mastered.
  const stickers = useMemo(() => {
    const masteredSet = new Set(progress.mastered);
    const byImage = new Map();
    for (const q of getAllQuestions()) {
      if (!q.imageUrl) continue;
      const already = byImage.get(q.imageUrl) ?? false;
      byImage.set(q.imageUrl, already || masteredSet.has(q.id));
    }
    return [...byImage.entries()]
      .map(([imageUrl, collected]) => ({ imageUrl, collected }))
      // Collected first, so progress feels visible at the top.
      .sort((a, b) => Number(b.collected) - Number(a.collected));
  }, [progress.mastered]);

  const collected = stickers.filter((s) => s.collected).length;
  const total = stickers.length;
  const pct = total ? Math.round((collected / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">אוסף התמרורים</h1>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">כל תמרור ששולטים בו — נצבע ונכנס לאוסף!</p>

      <Card className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-lg font-bold text-slate-700 dark:text-slate-200">
            אספת {collected} מתוך {total}
          </span>
          <span className="text-lg font-bold text-amber-600 dark:text-amber-300">{pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {stickers.map((s) => (
          <div
            key={s.imageUrl}
            className={`flex aspect-square items-center justify-center rounded-xl border p-2 ${
              s.collected ? 'border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800' : 'border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800'
            }`}
          >
            {s.collected ? (
              <img src={s.imageUrl} alt="תמרור" loading="lazy" className="h-full w-full object-contain" />
            ) : (
              <div className="relative h-full w-full">
                <img
                  src={s.imageUrl}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-contain opacity-20 grayscale"
                />
                <span className="absolute inset-0 flex items-center justify-center text-slate-400">
                  <IconLock size={24} />
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
