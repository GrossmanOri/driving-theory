// Stores the last and best full-exam results, to show a readiness signal.
const KEY = 'driving-theory-exams';
export const PASS_MARK = 26;
export const EXAM_COUNT = 30;

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return { passes: 0 };
  }
}

export function saveExam(correct, total) {
  const s = read();
  const result = { correct, total, at: Date.now() };
  s.last = result;
  if (!s.best || correct > s.best.correct) s.best = result;
  if (correct >= PASS_MARK) s.passes = (s.passes || 0) + 1;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function getExams() {
  return read();
}

/** Rough readiness 0-100 from the best recent score, vs the pass mark. */
export function readiness() {
  const s = read();
  if (!s.best) return 0;
  return Math.min(100, Math.round((s.best.correct / EXAM_COUNT) * 100));
}
