import { useMemo, useState } from 'react';
import { getQuestionsByTopic, getTopics } from '../data/loader';
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

function shuffle(a) {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

// Targeted practice on the topic the user is weakest at.
export function Focus() {
  const { progress, recordAnswer, addBonus } = useProgressContext();

  const { topicName, questions } = useMemo(() => {
    const mastered = new Set(progress.mastered);
    const ranked = getTopics()
      .map((t) => {
        const qs = getQuestionsByTopic(t.id);
        const done = qs.filter((q) => mastered.has(q.id)).length;
        return { t, qs, ratio: qs.length ? done / qs.length : 1 };
      })
      .filter((x) => x.qs.length)
      .sort((a, b) => a.ratio - b.ratio);
    const weakest = ranked[0];
    if (!weakest) return { topicName: '', questions: [] };
    const pool = weakest.qs.filter((q) => !mastered.has(q.id));
    const pick = shuffle(pool.length ? pool : weakest.qs).slice(0, 5);
    return { topicName: weakest.t.name, questions: pick };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(questions.length === 0);

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <Card className="p-8">
          <div className="mb-4 text-6xl">💪</div>
          <h2 className="mb-2 text-3xl font-extrabold text-slate-800 dark:text-slate-100">כל הכבוד!</h2>
          <p className="mb-6 text-xl text-slate-500 dark:text-slate-400">חיזקת נושא שהיה פחות חזק 🎯</p>
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
      setDone(true);
      bigCelebrate();
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between text-base text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <IconTarget size={16} />
          תרגול ממוקד · {topicName}
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
        nextLabel={index + 1 < questions.length ? 'הבא' : 'סיום'}
      />
    </div>
  );
}
