import { useEffect, useRef, useState } from 'react';
import { useProgressContext } from '../hooks/ProgressContext';
import { levelInfo } from '../lib/levels';
import { bigCelebrate } from './confetti';
import { playLevelUp } from '../lib/sound';

// Watches points and celebrates whenever the user reaches a new rank.
export function LevelUpCelebration() {
  const { progress, loaded } = useProgressContext();
  const level = levelInfo(progress.points);
  const prev = useRef<number | null>(null);
  const [rank, setRank] = useState<{ name: string; icon: string } | null>(null);

  useEffect(() => {
    if (!loaded) return;
    if (prev.current === null) {
      prev.current = level.levelNumber; // baseline on first load — don't fire
      return;
    }
    if (level.levelNumber > prev.current) {
      prev.current = level.levelNumber;
      setRank({ name: level.rank.name, icon: level.rank.icon });
      playLevelUp();
      bigCelebrate();
    }
  }, [level.levelNumber, loaded]);

  if (!rank) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={() => setRank(null)}
    >
      <div className="animate-pop-in w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl dark:bg-slate-800">
        <div className="mb-3 text-7xl">{rank.icon}</div>
        <div className="mb-1 text-lg font-bold text-amber-500">עלית דרגה! 🎉</div>
        <h2 className="mb-4 text-3xl font-extrabold text-slate-800 dark:text-slate-100">{rank.name}</h2>
        <button
          onClick={() => setRank(null)}
          className="w-full rounded-2xl bg-sky-500 py-3 text-xl font-bold text-white hover:bg-sky-600"
        >
          ממשיכים! 🚀
        </button>
      </div>
    </div>
  );
}
