import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllQuestions } from '../data/loader';
import { speak, speechSupported } from '../lib/speech';
import { gw } from '../lib/gender';

interface Card {
  imageUrl: string;
  meaning: string;
}

// Learn-mode deck of road signs: see the sign, flip for its meaning.
export function Flashcards() {
  const cards = useMemo<Card[]>(() => {
    const seen = new Set<string>();
    const out: Card[] = [];
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
      <div className="mx-auto max-w-2xl px-4 py-10 text-center text-slate-500 dark:text-slate-400">
        אין תמרורים להצגה.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">כרטיסיות תמרורים 🃏</h1>
        <span className="text-base text-slate-500 dark:text-slate-400">
          {i + 1}/{cards.length}
        </span>
      </div>
      <p className="mb-5 text-base text-slate-500 dark:text-slate-400">לחצו על הכרטיס כדי לראות את הפירוש</p>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="flex min-h-[20rem] w-full flex-col items-center justify-center gap-4 rounded-3xl bg-white p-8 shadow-sm transition dark:bg-slate-800 dark:shadow-black/30"
      >
        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
          <img src={card.imageUrl} alt="תמרור" className="h-44 w-44 object-contain" />
        </div>
        {flipped ? (
          <p className="animate-pop-in text-center text-2xl font-bold text-sky-700 dark:text-sky-300">
            {card.meaning}
          </p>
        ) : (
          <p className="text-lg text-slate-400 dark:text-slate-500">לחצו לגילוי 👆</p>
        )}
      </button>

      <div className="mt-5 flex items-center justify-between gap-3">
        {speechSupported() && flipped && (
          <button
            onClick={() => speak(card.meaning)}
            className="rounded-2xl bg-sky-50 px-5 py-3 text-lg font-bold text-sky-700 hover:bg-sky-100 dark:bg-sky-500/15 dark:text-sky-300"
          >
            🔊 {gw('הקריאי', 'הקרא')} לי
          </button>
        )}
        <button
          onClick={next}
          className="ml-auto rounded-2xl bg-sky-500 px-8 py-3 text-xl font-bold text-white hover:bg-sky-600"
        >
          הבא →
        </button>
      </div>

      <Link to="/" className="mt-6 block text-center text-base text-slate-500 dark:text-slate-400">
        חזרה לבית
      </Link>
    </div>
  );
}
