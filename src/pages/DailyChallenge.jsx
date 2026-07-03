import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllQuestions } from '../data/loader';
import { useProgressContext } from '../hooks/ProgressContext';
import { QuestionCard } from '../components/QuestionCard';
import { bigCelebrate } from '../components/confetti';
import { bumpDaily } from '../lib/dailyGoal';
import { recordActivity } from '../lib/streak';
import { fetchExplanation } from '../lib/api';
import { EXPLAIN_ENABLED } from '../config';
import {
  CHALLENGE_BONUS,
  challengeDoneToday,
  dailyIndices,
  markChallengeDone,
} from '../lib/dailyChallenge';

export function DailyChallenge() {
  const { recordAnswer, addBonus } = useProgressContext();
  const questions = useMemo(() => {
    const all = getAllQuestions();
    return dailyIndices(all.length).map((i) => all[i]);
  }, []);

  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const alreadyDone = challengeDoneToday();

  if (done || (alreadyDone && index === 0)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <div className="rounded-3xl bg-white p-8 shadow-sm dark:bg-slate-800 dark:shadow-black/30">
          <div className="mb-4 text-6xl">🏆</div>
          <h2 className="mb-2 text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            {done ? `סיימת! +${CHALLENGE_BONUS} בונוס` : 'סיימת את האתגר היומי'}
          </h2>
          <p className="mb-6 text-xl text-slate-500 dark:text-slate-400">
            {done ? 'כל הכבוד על ההתמדה 💛' : 'מחר מחכה אתגר חדש 🎯'}
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
    else {
      if (!alreadyDone) {
        addBonus(CHALLENGE_BONUS);
        markChallengeDone();
      }
      setDone(true);
      bigCelebrate();
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between text-base text-slate-500 dark:text-slate-400">
        <span>🎯 אתגר יומי</span>
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
        nextLabel={index + 1 < questions.length ? 'הבא' : 'סיום האתגר'}
      />
    </div>
  );
}
