import { useMemo, useState } from 'react';
import { getAllQuestions } from '../data/loader';
import { useProgressContext } from '../hooks/useProgressContext';
import { QuestionCard } from '../components/QuestionCard';
import { Stars } from '../components/Stars';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { IconHome, IconRotate, IconPencil } from '../components/Icons';
import { bigCelebrate } from '../components/confetti';
import { bumpDaily } from '../lib/dailyGoal';
import { recordActivity } from '../lib/streak';
import { fetchExplanation } from '../lib/api';
import { EXPLAIN_ENABLED } from '../config';

const SIZE = 5;

function pickRandom(pool, n) {
  const all = [...pool];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.slice(0, n);
}

// Zero-friction "just a few questions" practice — random, no topic to pick.
export function QuickPractice() {
  const { progress, recordAnswer, addBonus } = useProgressContext();

  const questions = useMemo(() => pickRandom(getAllQuestions(), SIZE), []);

  const [index, setIndex] = useState(0);
  const [firstTry, setFirstTry] = useState(0);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <Card className="p-8">
          <div className="mb-4 text-6xl">🎉</div>
          <h2 className="mb-2 text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            כל הכבוד{progress.name ? `, ${progress.name}` : ''}!
          </h2>
          <p className="mb-5 text-xl text-slate-500 dark:text-slate-400">סיימת תרגול מהיר 💪</p>
          <div className="mb-6 flex justify-center">
            <Stars count={Math.min(firstTry, 3)} size="text-5xl" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={() => {
                setIndex(0);
                setFirstTry(0);
                setDone(false);
              }}
            >
              <IconRotate size={20} />
              עוד 5 שאלות
            </Button>
            <Button to="/" variant="secondary">
              <IconHome size={20} />
              חזרה לבית
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleNext = (firstTryCorrect) => {
    bumpDaily();
    recordActivity();
    if (firstTryCorrect) setFirstTry((n) => n + 1);
    if (index + 1 < questions.length) setIndex(index + 1);
    else {
      setDone(true);
      bigCelebrate();
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-base text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <IconPencil size={16} />
            תרגול מהיר
          </span>
          <span>
            {index + 1}/{questions.length}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-sky-400 transition-all"
            style={{ width: `${(index / questions.length) * 100}%` }}
          />
        </div>
      </div>
      <QuestionCard
        key={questions[index].id}
        question={questions[index]}
        onAward={recordAnswer}
        onBonus={addBonus}
        onExplain={EXPLAIN_ENABLED ? fetchExplanation : undefined}
        onNext={handleNext}
        nextLabel={index + 1 < questions.length ? 'הבא' : 'סיום'}
      />
    </div>
  );
}
