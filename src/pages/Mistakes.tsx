import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getQuestionById } from '../data/loader';
import { useProgressContext } from '../hooks/ProgressContext';
import { QuestionCard } from '../components/QuestionCard';
import { bumpDaily } from '../lib/dailyGoal';
import { recordActivity } from '../lib/streak';

export function Mistakes() {
  const { progress, recordAnswer, addBonus } = useProgressContext();
  // Snapshot at mount so the list doesn't shrink under us as we fix them.
  const questions = useMemo(
    () => progress.mistakes.map(getQuestionById).filter(Boolean),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  ) as NonNullable<ReturnType<typeof getQuestionById>>[];

  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(questions.length === 0);

  if (done || questions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="mb-4 text-6xl">{questions.length === 0 ? '🌟' : '💪'}</div>
          <h2 className="mb-2 text-3xl font-extrabold text-slate-800">
            {questions.length === 0 ? 'אין טעויות לתרגל!' : 'תרגלת את כל הטעויות!'}
          </h2>
          <p className="mb-6 text-xl text-slate-500">
            {questions.length === 0 ? 'מצב מצוין! אפשר ללמוד נושא חדש.' : 'כל פעם שחוזרים על משהו, הוא נדבק יותר טוב.'}
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
      <div className="mb-4 flex items-center justify-between text-base text-slate-500">
        <span>🔁 תרגול טעויות</span>
        <span>
          {index + 1}/{questions.length}
        </span>
      </div>
      <QuestionCard
        key={questions[index].id}
        question={questions[index]}
        onAward={recordAnswer}
        onBonus={addBonus}
        onNext={handleNext}
        nextLabel={index + 1 < questions.length ? 'הבא' : 'סיום'}
      />
    </div>
  );
}
