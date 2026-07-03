import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllQuestions } from '../data/loader';
import { speak, speechSupported } from '../lib/speech';
import { gw } from '../lib/gender';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { IconVolume, IconArrowLeft, IconHome } from '../components/Icons';

// Learn-mode deck of road signs: see the sign, flip for its meaning.
export function Flashcards() {
  const cards = useMemo(() => {
    const seen = new Set();
    const out = [];
    for (const q of getAllQuestions()) {
      if (!q.imageUrl || seen.has(q.imageUrl)) continue;
      const correct = q.options.find((o) => o.correct);
      if (!correct) continue;
      seen.add(q.imageUrl);
      out.push({ imageUrl: q.imageUrl, meaning: correct.text });
    }
    return out;
  }, []);

  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[i];

  const next = () => {
    setFlipped(false);
    setI((n) => (n + 1) % cards.length);
  };

  if (!card) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <Card className="p-8">
          <p className="mb-6 text-xl text-slate-500 dark:text-slate-400">אין תמרורים להצגה.</p>
          <Button to="/" variant="secondary" className="mx-auto">
            <IconHome size={20} />
            חזרה לבית
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">כרטיסיות תמרורים 🃏</h1>
        <span className="text-base text-slate-500 dark:text-slate-400">
          {i + 1}/{cards.length}
        </span>
      </div>
      <p className="mb-5 text-base text-slate-500 dark:text-slate-400">לחצו על הכרטיס כדי לראות את הפירוש</p>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        className="flip-scene block w-full rounded-3xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 dark:focus-visible:ring-sky-500/40"
      >
        <div className={`flip-inner relative min-h-[20rem] w-full ${flipped ? 'is-flipped' : ''}`}>
          {/* FRONT — the sign */}
          <div className="flip-face absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl bg-white p-8 shadow-sm dark:bg-slate-800 dark:shadow-black/30">
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
              <img src={card.imageUrl} alt="תמרור" className="h-44 w-44 object-contain" />
            </div>
            <p className="text-lg text-slate-400 dark:text-slate-500">לחצו לגילוי 👆</p>
          </div>
          {/* BACK — the meaning */}
          <div className="flip-face flip-back absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl bg-white p-8 shadow-sm dark:bg-slate-800 dark:shadow-black/30">
            <div className="rounded-3xl bg-white p-3 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
              <img src={card.imageUrl} alt="תמרור" className="h-28 w-28 object-contain" />
            </div>
            <p className="text-center text-2xl font-bold text-sky-700 dark:text-sky-300">{card.meaning}</p>
          </div>
        </div>
      </button>

      <div className="mt-5 flex items-center justify-between gap-3">
        {speechSupported() && flipped && (
          <Button
            onClick={() => speak(card.meaning)}
            variant="ghost"
            className="bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-500/15 dark:text-sky-300"
          >
            <IconVolume size={20} />
            {gw('הקריאי', 'הקרא')} לי
          </Button>
        )}
        <Button onClick={next} className="ml-auto">
          הבא
          <IconArrowLeft size={20} />
        </Button>
      </div>

      <Link to="/" className="mt-6 block text-center text-base text-slate-500 dark:text-slate-400">
        חזרה לבית
      </Link>
    </div>
  );
}
