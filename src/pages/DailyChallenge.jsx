import { useMemo, useState } from 'react';
import { getAllQuestions } from '../data/loader';
import { useProgressContext } from '../hooks/useProgressContext';
import { QuestionCard } from '../components/QuestionCard';
import { bigCelebrate } from '../components/confetti';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { IconHome, IconTarget } from '../components/Icons';
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
        <Card className="p-8">
          <div className="mb-4 text-6xl">🏆</div>
          <h2 className="mb-2 text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            {done ? `סיימת! +${CHALLENGE_BONUS} בונוס` : 'סיימת את האתגר היומי'}
          </h2>
          <p className="mb-6 text-xl text-slate-500 dark:text-slate-400">
            {done ? 'כל הכבוד על ההתמדה 💛' : 'מחר מחכה אתגר חדש 🎯'}
          </p>
          <Button to="/" className="mx-auto">
            <IconHome size={20} />
            חזרה לבית
          </Button>
        </Card>
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
        <span className="inline-flex items-center gap-1.5">
          <IconTarget size={16} />
          אתגר יומי
        </span>
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
