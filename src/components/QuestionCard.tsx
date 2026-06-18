import { useMemo, useState } from 'react';
import type { Question } from '../data/types';
import { speak, speechSupported } from '../lib/speech';
import { celebrate } from './confetti';

interface Props {
  question: Question;
  /** Called once the question is resolved and the user taps "המשך". */
  onNext: (firstTryCorrect: boolean) => void;
  /** Award points immediately (learn mode). Returns points awarded. */
  onAward?: (questionId: string, correct: boolean, firstTry: boolean) => number;
  /** Exam mode: lock in the first answer, no retry, muted feedback. */
  examMode?: boolean;
  /** Label for the advance button. */
  nextLabel?: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function QuestionCard({ question, onNext, onAward, examMode = false, nextLabel = 'המשך' }: Props) {
  const options = useMemo(() => shuffle(question.options), [question.id]);
  const [selected, setSelected] = useState<string | null>(null);
  const [hadMistake, setHadMistake] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [floatPoints, setFloatPoints] = useState<number | null>(null);
  const [altExplain, setAltExplain] = useState(false);

  const handleSelect = (optId: string) => {
    if (resolved) return;
    const opt = options.find((o) => o.id === optId)!;
    const firstTry = !hadMistake;

    if (examMode) {
      setSelected(optId);
      setResolved(true);
      onAward?.(question.id, opt.correct, firstTry);
      return;
    }

    if (opt.correct) {
      setSelected(optId);
      setResolved(true);
      const pts = onAward?.(question.id, true, firstTry) ?? 0;
      if (pts > 0) {
        setFloatPoints(pts);
        setTimeout(() => setFloatPoints(null), 1000);
      }
      celebrate();
    } else {
      // Gentle: light shake, encouraging message, let her try again.
      setHadMistake(true);
      setShakeId(optId);
      onAward?.(question.id, false, firstTry);
      setTimeout(() => setShakeId(null), 400);
    }
  };

  const correctOptionId = options.find((o) => o.correct)!.id;

  return (
    <div className="relative mx-auto w-full max-w-2xl rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      {/* Sign / image — the visual hero */}
      {question.imageUrl && (
        <div className="mb-5 flex justify-center">
          <img
            src={question.imageUrl}
            alt="תמרור"
            className="h-40 w-40 object-contain sm:h-48 sm:w-48"
          />
        </div>
      )}

      <div className="mb-5 flex items-start justify-between gap-3">
        <h2 className="text-2xl font-bold leading-snug text-slate-800">{question.text}</h2>
        {speechSupported() && (
          <button
            onClick={() => speak(question.text)}
            className="shrink-0 rounded-full bg-sky-50 px-3 py-2 text-xl text-sky-600 hover:bg-sky-100"
            aria-label="הקראת השאלה"
            title="הקריאי לי"
          >
            🔊
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          const showCorrect = resolved && opt.id === correctOptionId;
          const isShaking = shakeId === opt.id;

          let cls =
            'flex min-h-[56px] items-center gap-3 rounded-2xl border-2 px-4 py-3 text-right text-xl transition';
          if (showCorrect) cls += ' border-green-400 bg-green-50 text-green-800';
          else if (examMode && isSelected) cls += ' border-sky-400 bg-sky-50 text-sky-800';
          else if (resolved) cls += ' border-slate-200 bg-white text-slate-400';
          else cls += ' border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50';
          if (isShaking) cls += ' animate-shake border-amber-300 bg-amber-50';

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              disabled={resolved}
              className={cls}
            >
              <span className="text-2xl">
                {showCorrect ? '✅' : examMode && isSelected ? '🔵' : '⭕'}
              </span>
              <span className="flex-1">{opt.text}</span>
            </button>
          );
        })}
      </div>

      {/* Floating +points */}
      {floatPoints !== null && (
        <div className="pointer-events-none absolute left-1/2 top-32 -translate-x-1/2 animate-float-up text-3xl font-extrabold text-green-500">
          +{floatPoints}
        </div>
      )}

      {/* Gentle retry message */}
      {!examMode && hadMistake && !resolved && (
        <p className="mt-4 text-center text-xl font-semibold text-amber-600">כמעט! נסי שוב 💛</p>
      )}

      {/* Explanation after resolving (learn mode) */}
      {!examMode && resolved && (
        <div className="mt-5 rounded-2xl bg-sky-50 p-4">
          <p className="text-lg leading-relaxed text-slate-700">
            {altExplain ? `במילים פשוטות: ${question.explanation}` : question.explanation}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {speechSupported() && (
              <button
                onClick={() => speak(question.explanation)}
                className="rounded-full bg-white px-4 py-2 text-base text-sky-700 shadow-sm hover:bg-sky-100"
              >
                🔊 הקריאי לי
              </button>
            )}
            <button
              onClick={() => setAltExplain((v) => !v)}
              className="rounded-full bg-white px-4 py-2 text-base text-sky-700 shadow-sm hover:bg-sky-100"
            >
              💡 תסבירי לי אחרת
            </button>
          </div>
        </div>
      )}

      {resolved && (
        <button
          onClick={() => onNext(!hadMistake)}
          className="mt-6 w-full rounded-2xl bg-green-500 py-4 text-2xl font-bold text-white shadow-md transition hover:bg-green-600"
        >
          {nextLabel}
        </button>
      )}
    </div>
  );
}
