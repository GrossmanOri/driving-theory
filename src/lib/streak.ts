// Forgiving daily streak. Activity on consecutive days grows the streak;
// missing a single day spends a "freeze" instead of resetting (never punishing).
const KEY = 'driving-theory-streak';

interface StreakState {
  lastDate: string; // YYYY-MM-DD
  streak: number;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

function read(): StreakState | null {
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null');
  } catch {
    return null;
  }
}

/** Call when the user does any activity. Returns the current streak. */
export function recordActivity(): number {
  const prev = read();
  const t = today();
  if (!prev) {
    localStorage.setItem(KEY, JSON.stringify({ lastDate: t, streak: 1 }));
    return 1;
  }
  const gap = daysBetween(prev.lastDate, t);
  let streak = prev.streak;
  if (gap === 0) {
    return streak; // already counted today
  } else if (gap === 1 || gap === 2) {
    // gap of 2 = one missed day, forgiven (freeze).
    streak += 1;
  } else {
    streak = 1; // longer break — start fresh, gently
  }
  localStorage.setItem(KEY, JSON.stringify({ lastDate: t, streak }));
  return streak;
}

export function getStreak(): number {
  const prev = read();
  if (!prev) return 0;
  const gap = daysBetween(prev.lastDate, today());
  if (gap <= 2) return prev.streak; // still alive (with one forgiven day)
  return 0;
}
