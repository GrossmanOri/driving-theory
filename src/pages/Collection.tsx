import { useMemo } from 'react';
import { getAllQuestions } from '../data/loader';
import { useProgressContext } from '../hooks/ProgressContext';

interface Sticker {
  imageUrl: string;
  collected: boolean;
}

export function Collection() {
  const { progress } = useProgressContext();

  // One sticker per unique sign image; collected if any question using it is mastered.
  const stickers = useMemo<Sticker[]>(() => {
    const masteredSet = new Set(progress.mastered);
    const byImage = new Map<string, boolean>();
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
      <h1 className="mb-1 text-3xl font-extrabold text-slate-800">אוסף התמרורים 🚸</h1>
      <p className="mb-4 text-lg text-slate-500">כל תמרור שתשלטי בו — נצבע ונכנס לאוסף!</p>

      <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-lg font-bold text-slate-700">
            אספת {collected} מתוך {total}
          </span>
          <span className="text-lg font-bold text-amber-600">{pct}%</span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {stickers.map((s) => (
          <div
            key={s.imageUrl}
            className={`flex aspect-square items-center justify-center rounded-2xl border-2 p-2 ${
              s.collected ? 'border-amber-200 bg-white shadow-sm' : 'border-slate-100 bg-slate-100'
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
                <span className="absolute inset-0 flex items-center justify-center text-2xl">🔒</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
