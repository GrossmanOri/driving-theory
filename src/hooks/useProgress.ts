import { useCallback, useEffect, useState } from 'react';
import type { CardState } from '../lib/leitner';
import { initialCard, review } from '../lib/leitner';

const STORAGE_KEY = 'driving-theory-progress-v1';

export interface Progress {
  points: number;
  /** Leitner card state per question id. */
  cards: Record<string, CardState>;
  /** Question ids currently in the mistake bank. */
  mistakes: string[];
  /** Question ids answered correctly on the first try (drives stars + collection). */
  mastered: string[];
  /** Stars earned per lesson key (`topicId:index`), 0..3. */
  stars: Record<string, number>;
  settings: {
    fontSizePx: number;
    examTimer: boolean;
  };
}

const defaultProgress: Progress = {
  points: 0,
  cards: {},
  mistakes: [],
  mastered: [],
  stars: {},
  settings: { fontSizePx: 18, examTimer: true },
};

function load(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw);
    return { ...defaultProgress, ...parsed, settings: { ...defaultProgress.settings, ...parsed.settings } };
  } catch {
    return defaultProgress;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(load);

  // Persist on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      /* ignore quota errors */
    }
  }, [progress]);

  // Apply font-size setting to the document root.
  useEffect(() => {
    document.documentElement.style.setProperty('--app-font-size', `${progress.settings.fontSizePx}px`);
  }, [progress.settings.fontSizePx]);

  /**
   * Record an answer. Returns the points awarded so the UI can animate them.
   * 10 points on a first-try correct answer, 5 if correct after a mistake.
   */
  const recordAnswer = useCallback(
    (questionId: string, correct: boolean, firstTry: boolean): number => {
      let awarded = 0;
      setProgress((prev) => {
        const card = prev.cards[questionId] ?? initialCard();
        const nextCards = { ...prev.cards, [questionId]: review(card, correct) };

        let mistakes = prev.mistakes;
        let mastered = prev.mastered;
        let points = prev.points;

        if (correct) {
          awarded = firstTry ? 10 : 5;
          points += awarded;
          mistakes = prev.mistakes.filter((id) => id !== questionId);
          if (firstTry && !prev.mastered.includes(questionId)) {
            mastered = [...prev.mastered, questionId];
          }
        } else if (!prev.mistakes.includes(questionId)) {
          mistakes = [...prev.mistakes, questionId];
        }

        return { ...prev, cards: nextCards, mistakes, mastered, points };
      });
      return awarded;
    },
    [],
  );

  /** Record stars for a finished lesson (keep the best result). */
  const recordLessonStars = useCallback((lessonKey: string, stars: number) => {
    setProgress((prev) => ({
      ...prev,
      stars: { ...prev.stars, [lessonKey]: Math.max(prev.stars[lessonKey] ?? 0, stars) },
    }));
  }, []);

  const setFontSize = useCallback((px: number) => {
    setProgress((prev) => ({ ...prev, settings: { ...prev.settings, fontSizePx: px } }));
  }, []);

  const setExamTimer = useCallback((on: boolean) => {
    setProgress((prev) => ({ ...prev, settings: { ...prev.settings, examTimer: on } }));
  }, []);

  const totalStars = Object.values(progress.stars).reduce((a, b) => a + b, 0);

  return {
    progress,
    recordAnswer,
    recordLessonStars,
    setFontSize,
    setExamTimer,
    totalStars,
  };
}
