import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getQuestionById } from '../data/loader';
import { useProgressContext } from '../hooks/ProgressContext';
import { QuestionCard } from '../components/QuestionCard';
import { isDue } from '../lib/leitner';
import { bumpDaily } from '../lib/dailyGoal';
import { recordActivity } from '../lib/streak';
import { fetchExplanation } from '../lib/api';
import { EXPLAIN_ENABLED } from '../config';

// Spaced-repetition review: shows questions whose Leitner box says they're due,
// so knowledge is re-tested right before it would be forgotten.
export function Review() {
  const { progress, recordAnswer, addBonus } = useProgressContext();

  const questions = useMemo(() => {
    const now = Date.now();
    return Object.entries(progress.cards)
      .filter(([, card]) => isDue(card, now))
      .map(([id]) => getQuestionById(id))
      .filter(Boolean)
      .slice(0, 20) as NonNullable<ReturnType<typeof getQuestionById>>[];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(questions.length === 0);

  if (done || questions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <div className="rounded-3xl bg-white p-8 shadow-sm dark:bg-slate-800 dark:shadow-black/30">
          <div className="mb-4 text-6xl">{questions.length === 0 ? '✨' : '🎉'}</div>
          <h2 className="mb-2 text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            {questions.length === 0 ? 'אין מה לחזור כרגע' : 'סיימת את החזרה!'}
          </h2>
          <p className="mb-6 text-xl text-slate-500 dark:text-slate-400">
            {questions.length === 0
              ? 'חזרה חכמה מופיעה כשמתקרב הזמן לרענן שאלות שלמדת. בינתיים אפשר ללמוד נושא חדש.'
              : 'חזרה במרווחים היא הדרך הכי טובה לזכור לטווח ארוך 💪'}
          </p>
          <Link to="/" className="rounded-2xl bg-sky-500 px-6 py-3 text-xl font-bold text-white hover:bg-sky-600">
            חזרה לבית
          </Link>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    bumpDaily();
    recordActivity();
    if (index + 1 < questions.length) setIndex(index + 1);
    else setDone(true);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between text-base text-slate-500 dark:text-slate-400">
        <span>🔄 חזרה חכמה</span>
        <span>
          {index + 1}/{questions.length}
        </span>
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
