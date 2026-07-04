import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLessons, getTopic } from '../data/loader';
import { useProgressContext } from '../hooks/useProgressContext';
import { QuestionCard } from '../components/QuestionCard';
import { Stars } from '../components/Stars';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { IconAlert, IconHome, IconRotate } from '../components/Icons';
import { bigCelebrate } from '../components/confetti';
import { bumpDaily, DAILY_GOAL } from '../lib/dailyGoal';
import { recordActivity } from '../lib/streak';
import { fetchExplanation } from '../lib/api';
import { EXPLAIN_ENABLED } from '../config';

export function Learn() {
  const { topicId = '', lessonIndex = '0' } = useParams();
  const { progress, recordAnswer, recordLessonStars, addBonus } = useProgressContext();

  const topic = getTopic(topicId);
  const lessons = getLessons(topicId);
  const lesson = lessons[Number(lessonIndex)] ?? [];
  const lessonKey = `${topicId}:${lessonIndex}`;

  const [index, setIndex] = useState(0);
  const [firstTryCount, setFirstTryCount] = useState(0);
  const [done, setDone] = useState(false);
  const [goalToast, setGoalToast] = useState(false);

  const stars = useMemo(() => Math.min(firstTryCount, 3), [firstTryCount]);

  if (!topic || lesson.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <Card className="p-8">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
              <IconAlert size={28} />
            </div>
          </div>
          <p className="mb-6 text-xl text-slate-500 dark:text-slate-400">השיעור לא נמצא.</p>
          <Button to="/" variant="secondary" className="mx-auto">
            <IconHome size={20} />
            חזרה לבית
          </Button>
        </Card>
      </div>
    );
  }

  const handleNext = (firstTryCorrect) => {
    const dailyCount = bumpDaily();
    recordActivity();
    if (dailyCount === DAILY_GOAL) {
      bigCelebrate();
      setGoalToast(true);
      setTimeout(() => setGoalToast(false), 2500);
    }
    const newFirstTry = firstTryCount + (firstTryCorrect ? 1 : 0);
    setFirstTryCount(newFirstTry);

    if (index + 1 < lesson.length) {
      setIndex(index + 1);
    } else {
      recordLessonStars(lessonKey, Math.min(newFirstTry, 3));
      setDone(true);
      bigCelebrate();
    }
  };

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <Card className="p-8">
          <div className="mb-4 text-6xl">🎉</div>
          <h2 className="mb-2 text-2xl font-bold text-slate-800 dark:text-slate-100">
            כל הכבוד{progress.name ? `, ${progress.name}` : ''}! 🎉
          </h2>
          <p className="mb-5 text-xl text-slate-500 dark:text-slate-400">סיימת את השיעור — זה מה שחשוב.</p>
          <div className="mb-6 flex justify-center">
            <Stars count={stars} size="text-5xl" animate />
          </div>
          <GoalToast show={goalToast} />
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button to="/">
              <IconHome size={20} />
              חזרה לבית
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIndex(0);
                setFirstTryCount(0);
                setDone(false);
              }}
            >
              <IconRotate size={20} />
              לתרגל שוב
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-base text-slate-500 dark:text-slate-400">
          <span>
            {topic.icon} {topic.name} · שיעור {Number(lessonIndex) + 1}
          </span>
          <span>
            {index + 1}/{lesson.length}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-sky-600 transition-all"
            style={{ width: `${((index) / lesson.length) * 100}%` }}
          />
        </div>
      </div>

      <QuestionCard
        key={lesson[index].id}
        question={lesson[index]}
        onAward={recordAnswer}
        onBonus={addBonus}
        onExplain={EXPLAIN_ENABLED ? fetchExplanation : undefined}
        onNext={handleNext}
        nextLabel={index + 1 < lesson.length ? 'לשאלה הבאה' : 'סיום השיעור'}
      />
      <GoalToast show={goalToast} />
    </div>
  );
}

// Celebratory banner when the daily goal is reached mid-session.
function GoalToast({ show }) {
  if (!show) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-40 flex justify-center px-4" aria-hidden="true">
      <div className="animate-bounce-in rounded-2xl bg-amber-50 px-6 py-3 text-center text-lg font-black text-amber-600 shadow-xl ring-2 ring-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400">
        היעד היומי הושלם! 🎯
      </div>
    </div>
  );
}
