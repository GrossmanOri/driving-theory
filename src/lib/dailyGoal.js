// Tracks how many questions were answered today, for the gentle daily goal.
const KEY = 'driving-theory-daily';
export const DAILY_GOAL = 5;

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function getDailyCount() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
    return raw.date === today() ? raw.count ?? 0 : 0;
  } catch {
    return 0;
  }
}

export function bumpDaily() {
  const count = getDailyCount() + 1;
  localStorage.setItem(KEY, JSON.stringify({ date: today(), count }));
  return count;
}
