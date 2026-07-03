import { useCallback, useEffect, useRef, useState } from 'react';
import { initialCard, review } from '../lib/leitner';
import { fetchProgress, saveProgress } from '../lib/api';

const defaultProgress = {
  name: '',
  gender: '',
  points: 0,
  cards: {},
  mistakes: [],
  mastered: [],
  stars: {},
  settings: { fontSizePx: 18, examTimer: true },
};

// --- Convert saved DynamoDB items into our in-memory Progress shape. ---
function fromItems(items) {
  const p = { ...defaultProgress, cards: {}, mistakes: [], mastered: [], stars: {} };
  for (const it of items) {
    if (it.sk === 'PROFILE') {
      p.name = it.name ?? '';
      p.gender = it.gender ?? '';
      p.points = it.points ?? 0;
      p.settings = { ...defaultProgress.settings, ...it.settings };
    } else if (it.sk.startsWith('Q#')) {
      const id = it.sk.slice(2);
      p.cards[id] = { box: it.box ?? 1, nextDue: it.nextDue ?? 0 };
      if (it.mistake) p.mistakes.push(id);
      if (it.mastered) p.mastered.push(id);
    } else if (it.sk.startsWith('LESSON#')) {
      p.stars[it.sk.slice(7)] = it.stars ?? 0;
    }
  }
  return p;
}

export function useProgress() {
  const [progress, setProgress] = useState(defaultProgress);
  const [loaded, setLoaded] = useState(false);

  // Pending cloud writes, flushed on a short debounce.
  const pending = useRef(new Map());
  const timer = useRef(undefined);

  const flush = useCallback(() => {
    const items = [...pending.current.values()];
    pending.current.clear();
    if (items.length) saveProgress(items).catch(() => {/* stay usable offline */});
  }, []);

  const queue = useCallback(
    (item) => {
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
    (p) =>
      queue({ sk: 'PROFILE', name: p.name, gender: p.gender, points: p.points, settings: p.settings }),
    [queue],
  );

  const setProfile = useCallback(
    (name, gender) => {
      setProgress((prev) => {
        const next = { ...prev, name, gender };
        queueProfile(next);
        return next;
      });
    },
    [queueProfile],
  );

  // Variable surprise reward — extra points on a lucky correct answer.
  const addBonus = useCallback(
    (pts) => {
      setProgress((prev) => {
        const next = { ...prev, points: prev.points + pts };
        queueProfile(next);
        return next;
      });
    },
    [queueProfile],
  );

  const recordAnswer = useCallback(
    (questionId, correct, firstTry) => {
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
    (lessonKey, stars) => {
      setProgress((prev) => {
        const best = Math.max(prev.stars[lessonKey] ?? 0, stars);
        queue({ sk: `LESSON#${lessonKey}`, stars: best });
        return { ...prev, stars: { ...prev.stars, [lessonKey]: best } };
      });
    },
    [queue],
  );

  const setFontSize = useCallback(
    (px) => {
      setProgress((prev) => {
        const next = { ...prev, settings: { ...prev.settings, fontSizePx: px } };
        queueProfile(next);
        return next;
      });
    },
    [queueProfile],
  );

  const setExamTimer = useCallback(
    (on) => {
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
    setProfile,
    addBonus,
    recordAnswer,
    recordLessonStars,
    setFontSize,
    setExamTimer,
    totalStars,
  };
}
