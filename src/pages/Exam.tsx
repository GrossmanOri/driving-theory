import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Question } from '../data/types';
import { buildExam } from '../data/loader';
import { useProgressContext } from '../hooks/ProgressContext';
import { QuestionCard } from '../components/QuestionCard';
import { bigCelebrate } from '../components/confetti';

const EXAM_COUNT = 30;
const PASS_MARK = 26;
const EXAM_SECONDS = 40 * 60;

type Phase = 'intro' | 'running' | 'result';

interface Answer {
  question: Question;
  correct: boolean;
}

function fmt(sec: number): string {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function Exam() {
  const { progress, recordAnswer, setExamTimer } = useProgressContext();
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(EXAM_SECONDS);

  const timerOn = progress.settings.examTimer;

  // Countdown when the timer is enabled and the exam is running.
  useEffect(() => {
    if (phase !== 'running' || !timerOn) return;
    if (timeLeft <= 0) {
      setPhase('result');
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, timerOn, timeLeft]);

  const start = () => {
    setQuestions(buildExam(EXAM_COUNT));
    setIndex(0);
    setAnswers([]);
    setTimeLeft(EXAM_SECONDS);
    setPhase('running');
  };

  const handleAward = (questionId: string, correct: boolean) => {
    recordAnswer(questionId, correct, true);
    return 0; // no floating points in exam mode
  };

  const handleNext = () => {
    if (index + 1 < questions.length) setIndex(index + 1);
    else setPhase('result');
  };

  const result = useMemo(() => {
    const correct = answers.filter((a) => a.correct).length;
    return { correct, total: answers.length, passed: correct >= PASS_MARK };
  }, [answers]);

  useEffect(() => {
    if (phase === 'result' && result.passed) bigCelebrate();
  }, [phase]);

  // --- INTRO ---
  if (phase === 'intro') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-3xl bg-white p-8 shadow-sm dark:bg-slate-800 dark:shadow-black/30">
          <div className="mb-3 text-center text-6xl">🎓</div>
          <h2 className="mb-3 text-center text-3xl font-extrabold text-slate-800 dark:text-slate-100">מבחן דמה</h2>
          <ul className="mb-6 space-y-2 text-lg text-slate-600 dark:text-slate-300">
            <li>📋 {EXAM_COUNT} שאלות</li>
            <li>✅ עוברים עם {PASS_MARK} תשובות נכונות (עד 4 טעויות)</li>
            <li>⏱️ 40 דקות — אפשר לכבות את הטיימר</li>
            <li>💛 זה רק תרגול. גם אם לא עוברים — לומדים מזה.</li>
          </ul>
          <label className="mb-6 flex items-center justify-between rounded-2xl bg-slate-50 p-4">
            <span className="text-lg font-bold text-slate-700 dark:text-slate-200">טיימר פעיל</span>
            <button
              onClick={() => setExamTimer(!timerOn)}
              className={`h-8 w-14 rounded-full transition ${timerOn ? 'bg-green-400' : 'bg-slate-300'}`}
            >
              <span
                className={`block h-7 w-7 rounded-full bg-white shadow transition ${
                  timerOn ? 'translate-x-0' : '-translate-x-6'
                }`}
              />
            </button>
          </label>
          <button
            onClick={start}
            className="w-full rounded-2xl bg-sky-500 py-4 text-2xl font-bold text-white hover:bg-sky-600"
          >
            מתחילים!
          </button>
        </div>
      </div>
    );
  }

  // --- RESULT ---
  if (phase === 'result') {
    const missed = answers.filter((a) => !a.correct);
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm dark:bg-slate-800 dark:shadow-black/30">
          <div className="mb-3 text-6xl">{result.passed ? '🎉' : '💪'}</div>
          <h2 className="mb-2 text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            {progress.name ? `${progress.name}, ` : ''}
            {result.passed ? 'עברת! מדהים!' : 'כל הכבוד שסיימת!'}
          </h2>
          <p className="mb-4 text-2xl font-bold text-slate-700 dark:text-slate-200">
            {result.correct}/{result.total}
          </p>
          <p className="mb-6 text-lg text-slate-500 dark:text-slate-400">
            {result.passed
              ? `מעל ${PASS_MARK} — בדיוק מה שצריך במבחן האמיתי.`
              : `צריך ${PASS_MARK} כדי לעבור. עוד קצת תרגול וזה אצלך בכיס 💛`}
          </p>

          {missed.length > 0 && (
            <div className="mb-6 text-right">
              <h3 className="mb-3 text-xl font-bold text-slate-700 dark:text-slate-200">שאלות לחזור עליהן:</h3>
              <div className="space-y-3">
                {missed.map((a, i) => (
                  <div key={i} className="rounded-2xl bg-amber-50 p-4">
                    <p className="mb-1 font-semibold text-slate-700 dark:text-slate-200">{a.question.text}</p>
                    <p className="text-green-700">
                      ✅ {a.question.options.find((o) => o.correct)?.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => setPhase('intro')}
              className="rounded-2xl bg-sky-500 px-6 py-3 text-xl font-bold text-white hover:bg-sky-600"
            >
              מבחן נוסף
            </button>
            <Link to="/mistakes" className="rounded-2xl bg-purple-400 px-6 py-3 text-xl font-bold text-white hover:bg-purple-500">
              לתרגל את הטעויות
            </Link>
            <Link to="/" className="rounded-2xl bg-slate-100 px-6 py-3 text-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600">
              לבית
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- RUNNING ---
  const q = questions[index];
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-lg font-bold text-slate-600 dark:text-slate-300">
          שאלה {index + 1}/{questions.length}
        </span>
        {timerOn && (
          <span className={`rounded-full px-3 py-1 text-lg font-bold ${timeLeft < 60 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600 dark:text-slate-300'}`}>
            ⏱️ {fmt(timeLeft)}
          </span>
        )}
      </div>
      <QuestionCard
        key={q.id}
        question={q}
        examMode
        onAward={(id, correct) => {
          setAnswers((prev) => [...prev, { question: q, correct }]);
          return handleAward(id, correct);
        }}
        onNext={handleNext}
        nextLabel={index + 1 < questions.length ? 'הבאה' : 'סיום המבחן'}
      />
    </div>
  );
}
