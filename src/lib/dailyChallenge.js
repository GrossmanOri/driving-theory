// A deterministic "challenge of the day": everyone (well, this user) gets the
// same set on a given date, with a completion flag for the bonus.
const KEY = 'driving-theory-daily-challenge';
export const CHALLENGE_SIZE = 7;
export const CHALLENGE_BONUS = 30;

function today() {
  return new Date().toISOString().slice(0, 10);
}

// Seeded RNG so the day's picks are stable.
function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromDate(d) {
  let h = 0;
  for (let i = 0; i < d.length; i++) h = (h * 31 + d.charCodeAt(i)) | 0;
  return h;
}

/** Stable indices into a list of `length` items for today. */
export function dailyIndices(length) {
  const rng = mulberry32(seedFromDate(today()));
  const idx = Array.from({ length }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, CHALLENGE_SIZE);
}

export function challengeDoneToday() {
  return localStorage.getItem(KEY) === today();
}
export function markChallengeDone() {
  localStorage.setItem(KEY, today());
}
