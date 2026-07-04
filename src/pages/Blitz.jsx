import { useEffect, useMemo, useState } from 'react';
import { getAllQuestions } from '../data/loader';
import { playCorrect, playWrong, playFinish } from '../lib/sound';
import { bigCelebrate } from '../components/confetti';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { IconZap, IconHome } from '../components/Icons';

const DURATION = 60;
const BEST_KEY = 'driving-theory-blitz-best';

function shuffle(a) {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function loadBest() {
  return Number(localStorage.getItem(BEST_KEY) || 0);
}

export function Blitz() {
  const deck = useMemo(() => shuffle(getAllQuestions()), []);
  const [phase, setPhase] = useState('intro');
  const [pos, setPos] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(DURATION);
  const [flash, setFlash] = useState(null);
  const [best, setBest] = useState(loadBest);

  useEffect(() => {
    if (phase !== 'play' || time <= 0) return;
    const id = setTimeout(() => {
      if (time <= 1) {
        // Time's up — lock in the score and celebrate.
        if (score > best) {
          setBest(score);
          localStorage.setItem(BEST_KEY, String(score));
        }
        playFinish();
        bigCelebrate();
        setPhase('done');
      }
      setTime(time - 1);
    }, 1000);
    return () => clearTimeout(id);
  }, [phase, time, score, best]);

  const start = () => {
    setPos(0);
    setScore(0);
    setTime(DURATION);
    setPhase('play');
  };

  const answer = (correct) => {
    if (correct) {
      setScore((s) => s + 1);
      playCorrect();
      setFlash('ok');
    } else {
      playWrong();
      setFlash('no');
    }
    setTimeout(() => setFlash(null), 150);
    setPos((p) => p + 1);
  };

  if (phase === 'intro') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Card className="p-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-slate-800 dark:text-slate-100">בליץ — דקה אחת</h2>
          <p className="mb-6 text-lg text-slate-500 dark:text-slate-400">
            כמה תשובות נכונות תספיקו ב-60 שניות? שיא נוכחי: {best} 🏆
          </p>
          <Button onClick={start} variant="warning" size="lg">
            יאללה! ⚡
          </Button>
        </Card>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Card className="p-8 text-center">
          <div className="mb-3 text-6xl">🎉</div>
          <h2 className="mb-2 text-2xl font-bold text-slate-800 dark:text-slate-100">{score} נכונות!</h2>
          <p className="mb-6 text-lg text-slate-500 dark:text-slate-400">השיא שלך: {best} 🏆</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={start} variant="warning">
              עוד פעם ⚡
            </Button>
            <Button to="/" variant="secondary">
              <IconHome size={20} />
              לבית
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const q = deck[pos % deck.length];
  const ringColor = time <= 10 ? 'text-red-500' : 'text-amber-500';
  return (
    <div
      className={`mx-auto max-w-2xl px-4 py-6 transition-colors ${flash === 'ok' ? 'bg-green-50 dark:bg-green-500/10' : flash === 'no' ? 'bg-amber-50 dark:bg-amber-500/10' : ''}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xl font-bold text-slate-700 dark:border-slate-700 dark:text-slate-200">
          <IconZap size={20} className="text-amber-500" />
          {score}
        </span>
        <span className={`inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xl font-bold tabular-nums dark:border-slate-700 ${ringColor}`}>{time}s</span>
      </div>
      <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        {q.imageUrl && (
          <div className="mb-4 flex justify-center">
            <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
              <img src={q.imageUrl} alt="תמרור" className="h-32 w-32 object-contain" />
            </div>
          </div>
        )}
        <h2 className="mb-4 text-xl font-bold text-slate-800 dark:text-slate-100">{q.text}</h2>
        <div className="flex flex-col gap-2">
          {q.options.map((o) => (
            <button
              key={o.id}
              onClick={() => answer(o.correct)}
              className="min-h-[52px] rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-right text-lg text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-amber-500/10 dark:focus-visible:ring-amber-500/40"
            >
              {o.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
