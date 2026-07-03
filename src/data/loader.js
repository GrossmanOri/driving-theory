import { LESSON_SIZE } from './types';

// Topic config: maps each gov.il Hebrew category to a clean URL slug + icon.
const TOPIC_CONFIG = [
  { id: 'signs', category: 'תמרורים', name: 'תמרורים', icon: '🚸' },
  { id: 'rules', category: 'חוקי התנועה', name: 'חוקי התנועה', icon: '🚦' },
  { id: 'safety', category: 'בטיחות', name: 'בטיחות', icon: '🦺' },
  { id: 'vehicle', category: 'הכרת הרכב', name: 'הכרת הרכב', icon: '🚗' },
];

const categoryToSlug = new Map(TOPIC_CONFIG.map((t) => [t.category, t.id]));

// Questions are loaded from the API at startup, then cached here.
let allQuestions = [];

/** Called once after fetching from the API. Remaps category -> topic slug. */
export function setQuestions(questions) {
  allQuestions = questions.map((q) => ({
    ...q,
    topicId: categoryToSlug.get(q.topicId) ?? 'other',
  }));
}

export function getTopics() {
  return TOPIC_CONFIG.map(({ id, name, icon }) => ({ id, name, icon }));
}

export function getTopic(id) {
  return getTopics().find((t) => t.id === id);
}

export function getAllQuestions() {
  return allQuestions;
}

export function getQuestionsByTopic(topicId) {
  return allQuestions.filter((q) => q.topicId === topicId);
}

export function getQuestionById(id) {
  return allQuestions.find((q) => q.id === id);
}

/** Group a topic's questions into lessons of LESSON_SIZE. */
export function getLessons(topicId) {
  const qs = getQuestionsByTopic(topicId);
  const lessons = [];
  for (let i = 0; i < qs.length; i += LESSON_SIZE) {
    lessons.push(qs.slice(i, i + LESSON_SIZE));
  }
  return lessons;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build an exam of `count` questions, weighting signs + right-of-way topics
 * higher (~35%), mirroring the real test emphasis.
 */
export function buildExam(count = 30) {
  const weighted = ['signs', 'rules'];
  const priority = shuffle(allQuestions.filter((q) => weighted.includes(q.topicId)));
  const rest = shuffle(allQuestions.filter((q) => !weighted.includes(q.topicId)));
  const targetPriority = Math.round(count * 0.35);
  const picked = [
    ...priority.slice(0, targetPriority),
    ...shuffle([...priority.slice(targetPriority), ...rest]),
  ];
  return picked.slice(0, count);
}
