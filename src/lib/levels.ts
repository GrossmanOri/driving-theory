// Driving-themed rank progression. XP is simply the user's points.

export interface Rank {
  name: string;
  icon: string;
  minXp: number;
}

export const RANKS: Rank[] = [
  { name: 'לומדת חדשה', icon: '🌱', minXp: 0 },
  { name: 'מתאמנת', icon: '🚸', minXp: 100 },
  { name: 'נהגת זהירה', icon: '🚗', minXp: 300 },
  { name: 'נהגת מנוסה', icon: '🛣️', minXp: 700 },
  { name: 'כמעט מוכנה', icon: '🏁', minXp: 1500 },
  { name: 'אלופת התיאוריה', icon: '🏆', minXp: 3000 },
];

export interface LevelInfo {
  rank: Rank;
  next: Rank | null;
  levelNumber: number; // 1-based
  xpIntoLevel: number;
  xpForLevel: number; // span of the current level (0 if max)
  progressPct: number; // 0..100 toward next rank
}

export function levelInfo(xp: number): LevelInfo {
  let idx = 0;
  for (let i = 0; i < RANKS.length; i++) {
    if (xp >= RANKS[i].minXp) idx = i;
  }
  const rank = RANKS[idx];
  const next = idx < RANKS.length - 1 ? RANKS[idx + 1] : null;
  const xpIntoLevel = xp - rank.minXp;
  const xpForLevel = next ? next.minXp - rank.minXp : 0;
  const progressPct = next ? Math.min(100, Math.round((xpIntoLevel / xpForLevel) * 100)) : 100;
  return { rank, next, levelNumber: idx + 1, xpIntoLevel, xpForLevel, progressPct };
}
