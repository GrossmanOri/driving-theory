import { useCallback, useEffect, useRef, useState } from 'react';
import type { CardState } from '../lib/leitner';
import { initialCard, review } from '../lib/leitner';
import { fetchProgress, saveProgress } from '../lib/api';
import type { ProgressItem } from '../lib/api';

export interface Progress {
  name: string;
  points: number;
  cards: Record<string, CardState>;
  mistakes: string[];
  mastered: string[];
  stars: Record<string, number>;
  settings: { fontSizePx: number; examTimer: boolean };
}

const defaultProgress: Progress = {
  name: '',
  points: 0,
  cards: {},
  mistakes: [],
  mastered: [],
  stars: {},
  settings: { fontSizePx: 18, examTimer: true },
};

// --- Convert saved DynamoDB items into our in-memory Progress shape. ---
function fromItems(items: ProgressItem[]): Progress {
  const p: Progress = { ...defaultProgress, cards: {}, mistakes: [], mastered: [], stars: {} };
  for (const it of items) {
    if (it.sk === 'PROFILE') {
      p.name = (it.name as string) ?? '';
      p.points = (it.points as number) ?? 0;
      p.settings = { ...defaultProgress.settings, ...(it.settings as object) };
    } else if (it.sk.startsWith('Q#')) {
      const id = it.sk.slice(2);
      p.cards[id] = { box: (it.box as number) ?? 1, nextDue: (it.nextDue as number) ?? 0 };
      if (it.mistake) p.mistakes.push(id);
      if (it.mastered) p.mastered.push(id);
    } else if (it.sk.startsWith('LESSON#')) {
      p.stars[it.sk.slice(7)] = (it.stars as number) ?? 0;
    }
  }
  return p;
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(defaultProgress);
  const [loaded, setLoaded] = useState(false);

  // Pending cloud writes, flushed on a short debounce.
  const pending = useRef<Map<string, ProgressItem>>(new Map());
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const flush = useCallback(() => {
    const items = [...pending.current.values()];
    pending.current.clear();
    if (items.length) saveProgress(items).catch(() => {/* stay usable offline */});
  }, []);

  const queue = useCallback(
    (item: ProgressItem) => {
      pending.current.set(item.sk, item);
      clearTimeout(timer.current);
      timer.current = setTimeout(flush, 1200);
    },
    [flush],
  );

  // Load saved progress from the cloud once, on mount.
  useEffect(() => {
    fetchProgress()
      .then((items) => setProgress(fromItems(items)))
      .catch(() => setProgress(defaultProgress))
      .finally(() => setLoaded(true));
  }, []);

  // Flush any pending writes before the tab closes.
  useEffect(() => {
    const handler = () => flush();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [flush]);

  // Apply font-size setting to the document root.
  useEffect(() => {
    document.documentElement.style.setProperty('--app-font-size', `${progress.settings.fontSizePx}px`);
  }, [progress.settings.fontSizePx]);

  const queueProfile = useCallback(
    (p: Progress) => queue({ sk: 'PROFILE', name: p.name, points: p.points, settings: p.settings }),
    [queue],
  );

  const setName = useCallback(
    (name: string) => {
      setProgress((prev) => {
        const next = { ...prev, name };
        queueProfile(next);
        return next;
      });
    },
    [queueProfile],
  );

  // Variable surprise reward — extra points on a lucky correct answer.
  const addBonus = useCallback(
    (pts: number) => {
      setProgress((prev) => {
        const next = { ...prev, points: prev.points + pts };
        queueProfile(next);
        return next;
      });
    },
    [queueProfile],
  );

  const recordAnswer = useCallback(
    (questionId: string, correct: boolean, firstTry: boolean): number => {
      let awarded = 0;
      setProgress((prev) => {
        const card = review(prev.cards[questionId] ?? initialCard(), correct);
        const cards = { ...prev.cards, [questionId]: card };

        let { mistakes, mastered, points } = prev;
        if (correct) {
          awarded = firstTry ? 10 : 5;
          points += awarded;
          mistakes = prev.mistakes.filter((id) => id !== questionId);
          if (firstTry && !prev.mastered.includes(questionId)) mastered = [...prev.mastered, questionId];
        } else if (!prev.mistakes.includes(questionId)) {
          mistakes = [...prev.mistakes, questionId];
        }

        const next = { ...prev, cards, mistakes, mastered, points };
        queue({
          sk: `Q#${questionId}`,
          box: card.box,
          nextDue: card.nextDue,
          mistake: mistakes.includes(questionId),
          mastered: mastered.includes(questionId),
        });
        queueProfile(next);
        return next;
      });
      return awarded;
    },
    [queue, queueProfile],
  );

  const recordLessonStars = useCallback(
    (lessonKey: string, stars: number) => {
      setProgress((prev) => {
        const best = Math.max(prev.stars[lessonKey] ?? 0, stars);
        queue({ sk: `LESSON#${lessonKey}`, stars: best });
        return { ...prev, stars: { ...prev.stars, [lessonKey]: best } };
      });
    },
    [queue],
  );

  const setFontSize = useCallback(
    (px: number) => {
      setProgress((prev) => {
        const next = { ...prev, settings: { ...prev.settings, fontSizePx: px } };
        queueProfile(next);
        return next;
      });
    },
    [queueProfile],
  );

  const setExamTimer = useCallback(
    (on: boolean) => {
      setProgress((prev) => {
        const next = { ...prev, settings: { ...prev.settings, examTimer: on } };
        queueProfile(next);
        return next;
      });
    },
    [queueProfile],
  );

  const totalStars = Object.values(progress.stars).reduce((a, b) => a + b, 0);

  return {
    progress,
    loaded,
    setName,
    addBonus,
    recordAnswer,
    recordLessonStars,
    setFontSize,
    setExamTimer,
    totalStars,
  };
}
