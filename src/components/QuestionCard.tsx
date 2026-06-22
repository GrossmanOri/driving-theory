import { useMemo, useState } from 'react';
import type { Question } from '../data/types';
import { speak, speechSupported } from '../lib/speech';
import { gw } from '../lib/gender';
import { celebrate } from './confetti';

interface Props {
  question: Question;
  /** Called once the question is resolved and the user taps "המשך". */
  onNext: (firstTryCorrect: boolean) => void;
  /** Award points immediately (learn mode). Returns points awarded. */
  onAward?: (questionId: string, correct: boolean, firstTry: boolean) => number;
  /** Grant a surprise bonus (learn mode only). */
  onBonus?: (points: number) => void;
  /** Fetch a simple AI explanation for the question (learn mode). */
  onExplain?: (questionId: string) => Promise<string>;
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

export function QuestionCard({
  question,
  onNext,
  onAward,
  onBonus,
  onExplain,
  examMode = false,
  nextLabel = 'המשך',
}: Props) {
  const options = useMemo(() => shuffle(question.options), [question.id]);
  const [selected, setSelected] = useState<string | null>(null);
  const [hadMistake, setHadMistake] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [shakeId, setShakeId] = useState<string | null>(null);
  const [floatPoints, setFloatPoints] = useState<number | null>(null);
  const [bonus, setBonus] = useState(false);
  const [explainText, setExplainText] = useState(question.explanation || '');
  const [explainLoading, setExplainLoading] = useState(false);
  const [explainError, setExplainError] = useState('');

  const handleExplain = async () => {
    if (!onExplain) return;
    setExplainLoading(true);
    setExplainError('');
    try {
      setExplainText(await onExplain(question.id));
    } catch {
      setExplainError('לא הצלחנו להסביר כרגע. ננסה שוב?');
    } finally {
      setExplainLoading(false);
    }
  };

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
      // ~15% lucky surprise bonus on a clean first-try answer.
      const lucky = firstTry && pts > 0 && onBonus && Math.random() < 0.15;
      if (lucky) {
        onBonus!(pts); // double it
        setBonus(true);
        setFloatPoints(pts * 2);
        setTimeout(() => setBonus(false), 1500);
      } else if (pts > 0) {
        setFloatPoints(pts);
      }
      if (pts > 0) setTimeout(() => setFloatPoints(null), 1200);
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
    <div className="relative mx-auto w-full max-w-2xl rounded-3xl bg-white p-6 shadow-sm sm:p-8 dark:bg-slate-800 dark:shadow-black/30">
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
        <h2 className="text-2xl font-bold leading-snug text-slate-800 dark:text-slate-100">{question.text}</h2>
        {speechSupported() && (
          <button
            onClick={() => speak(question.text)}
            className="shrink-0 rounded-full bg-sky-50 px-3 py-2 text-xl text-sky-600 hover:bg-sky-100"
            aria-label="הקראת השאלה"
            title={`${gw('הקריאי', 'הקרא')} לי`}
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
          if (showCorrect) cls += ' border-green-400 bg-green-50 text-green-800 dark:bg-green-500/15 dark:text-green-300';
          else if (examMode && isSelected) cls += ' border-sky-400 bg-sky-50 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300';
          else if (resolved) cls += ' border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500';
          else cls += ' border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:border-sky-500 dark:hover:bg-slate-600';
          if (isShaking) cls += ' animate-shake border-amber-300 bg-amber-50 dark:bg-amber-500/15';

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

      {/* Floating +points (with surprise bonus) */}
      {floatPoints !== null && (
        <div className="pointer-events-none absolute left-1/2 top-28 z-10 -translate-x-1/2 animate-float-up text-center">
          {bonus && <div className="text-xl font-extrabold text-amber-500">בונוס מזל! ✨ ×2</div>}
          <div className={`text-3xl font-extrabold ${bonus ? 'text-amber-500' : 'text-green-500'}`}>
            +{floatPoints}
          </div>
        </div>
      )}

      {/* Gentle retry message */}
      {!examMode && hadMistake && !resolved && (
        <p className="mt-4 text-center text-xl font-semibold text-amber-600">
          כמעט! {gw('נסי', 'נסה')} שוב 💛
        </p>
      )}

      {/* Explanation after resolving (learn mode) — only when available/enabled */}
      {!examMode && resolved && (explainText || onExplain) && (
        <div className="mt-5 rounded-2xl bg-sky-50 p-4 dark:bg-sky-500/10">
          {explainText ? (
            <>
              <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-200">{explainText}</p>
              {speechSupported() && (
                <button
                  onClick={() => speak(explainText)}
                  className="mt-3 rounded-full bg-white px-4 py-2 text-base text-sky-700 shadow-sm hover:bg-sky-100 dark:bg-slate-700 dark:text-sky-300"
                >
                  🔊 {gw('הקריאי', 'הקרא')} לי
                </button>
              )}
            </>
          ) : (
            <div className="text-center">
              <button
                onClick={handleExplain}
                disabled={explainLoading || !onExplain}
                className="rounded-full bg-sky-500 px-6 py-3 text-base font-bold text-white shadow-sm transition hover:bg-sky-600 disabled:opacity-60"
              >
                {explainLoading ? 'חושבים על הסבר… 🤔' : '💡 הסבירו לי בקלות'}
              </button>
              {explainError && <p className="mt-2 text-sm text-amber-600">{explainError}</p>}
            </div>
          )}
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
