import type { Question, Topic } from './types';
import { LESSON_SIZE } from './types';
import { seedQuestions, topics } from './seed';

// Single source of truth for the app. When the official bank is imported,
// only this loader needs to point at the new data file.
const allQuestions: Question[] = seedQuestions;

export function getTopics(): Topic[] {
  return topics;
}

export function getTopic(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}

export function getAllQuestions(): Question[] {
  return allQuestions;
}

export function getQuestionsByTopic(topicId: string): Question[] {
  return allQuestions.filter((q) => q.topicId === topicId);
}

export function getQuestionById(id: string): Question | undefined {
  return allQuestions.find((q) => q.id === id);
}

/** Group a topic's questions into lessons of LESSON_SIZE. */
export function getLessons(topicId: string): Question[][] {
  const qs = getQuestionsByTopic(topicId);
  const lessons: Question[][] = [];
  for (let i = 0; i < qs.length; i += LESSON_SIZE) {
    lessons.push(qs.slice(i, i + LESSON_SIZE));
  }
  return lessons;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build an exam of `count` questions, weighting signs + right-of-way higher
 * (~35% of the pool, mirroring the real test emphasis).
 */
export function buildExam(count = 30): Question[] {
  const weighted = ['signs', 'rightofway'];
  const priority = shuffle(allQuestions.filter((q) => weighted.includes(q.topicId)));
  const rest = shuffle(allQuestions.filter((q) => !weighted.includes(q.topicId)));

  const targetPriority = Math.round(count * 0.35);
  const picked = [
    ...priority.slice(0, targetPriority),
    ...rest,
    ...priority.slice(targetPriority),
  ];

  // With the small seed set we may have fewer than `count`; repeat-fill if needed.
  const result: Question[] = [];
  let i = 0;
  while (result.length < count && picked.length > 0) {
    result.push(picked[i % picked.length]);
    i++;
  }
  return shuffle(result).slice(0, Math.min(count, picked.length || count));
}
