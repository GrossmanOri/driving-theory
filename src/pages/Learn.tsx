import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getLessons, getTopic } from '../data/loader';
import { useProgressContext } from '../hooks/ProgressContext';
import { QuestionCard } from '../components/QuestionCard';
import { Stars } from '../components/Stars';
import { bigCelebrate } from '../components/confetti';
import { bumpDaily } from '../lib/dailyGoal';

export function Learn() {
  const { topicId = '', lessonIndex = '0' } = useParams();
  const { recordAnswer, recordLessonStars } = useProgressContext();

  const topic = getTopic(topicId);
  const lessons = getLessons(topicId);
  const lesson = lessons[Number(lessonIndex)] ?? [];
  const lessonKey = `${topicId}:${lessonIndex}`;

  const [index, setIndex] = useState(0);
  const [firstTryCount, setFirstTryCount] = useState(0);
  const [done, setDone] = useState(false);

  const stars = useMemo(() => Math.min(firstTryCount, 3), [firstTryCount]);

  if (!topic || lesson.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <p className="text-xl text-slate-500">השיעור לא נמצא.</p>
        <Link to="/" className="mt-4 inline-block text-sky-600">חזרה לבית</Link>
      </div>
    );
  }

  const handleNext = (firstTryCorrect: boolean) => {
    bumpDaily();
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
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="mb-4 text-6xl">🎉</div>
          <h2 className="mb-2 text-3xl font-extrabold text-slate-800">סיימת את השיעור!</h2>
          <p className="mb-5 text-xl text-slate-500">כל הכבוד שהתמדת — זה מה שחשוב.</p>
          <div className="mb-6 flex justify-center">
            <Stars count={stars} size="text-5xl" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/" className="rounded-2xl bg-sky-500 px-6 py-3 text-xl font-bold text-white hover:bg-sky-600">
              חזרה לבית
            </Link>
            <button
              onClick={() => {
                setIndex(0);
                setFirstTryCount(0);
                setDone(false);
              }}
              className="rounded-2xl bg-slate-100 px-6 py-3 text-xl font-bold text-slate-700 hover:bg-slate-200"
            >
              לתרגל שוב
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-base text-slate-500">
          <span>
            {topic.icon} {topic.name} · שיעור {Number(lessonIndex) + 1}
          </span>
          <span>
            {index + 1}/{lesson.length}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-sky-400 transition-all"
            style={{ width: `${((index) / lesson.length) * 100}%` }}
          />
        </div>
      </div>

      <QuestionCard
        key={lesson[index].id}
        question={lesson[index]}
        onAward={recordAnswer}
        onNext={handleNext}
        nextLabel={index + 1 < lesson.length ? 'לשאלה הבאה' : 'סיום השיעור'}
      />
    </div>
  );
}
