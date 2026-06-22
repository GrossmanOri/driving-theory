// Driving-themed rank progression. XP is simply the user's points.
import { gw } from './gender';

export interface Rank {
  name: string;
  icon: string;
  minXp: number;
}

// Rank names adapt to gender (gw = female, male). Built fresh each call,
// since gender is only known after the profile loads.
export function getRanks(): Rank[] {
  return [
    { name: gw('לומדת חדשה', 'לומד חדש'), icon: '🌱', minXp: 0 },
    { name: gw('מתאמנת', 'מתאמן'), icon: '🚸', minXp: 100 },
    { name: gw('נהגת זהירה', 'נהג זהיר'), icon: '🚗', minXp: 300 },
    { name: gw('נהגת מנוסה', 'נהג מנוסה'), icon: '🛣️', minXp: 700 },
    { name: gw('כמעט מוכנה', 'כמעט מוכן'), icon: '🏁', minXp: 1500 },
    { name: gw('אלופת התיאוריה', 'אלוף התיאוריה'), icon: '🏆', minXp: 3000 },
  ];
}

export interface LevelInfo {
  rank: Rank;
  next: Rank | null;
  levelNumber: number; // 1-based
  xpIntoLevel: number;
  xpForLevel: number; // span of the current level (0 if max)
  progressPct: number; // 0..100 toward next rank
}

export function levelInfo(xp: number): LevelInfo {
  const ranks = getRanks();
  let idx = 0;
  for (let i = 0; i < ranks.length; i++) {
    if (xp >= ranks[i].minXp) idx = i;
  }
  const rank = ranks[idx];
  const next = idx < ranks.length - 1 ? ranks[idx + 1] : null;
  const xpIntoLevel = xp - rank.minXp;
  const xpForLevel = next ? next.minXp - rank.minXp : 0;
  const progressPct = next ? Math.min(100, Math.round((xpIntoLevel / xpForLevel) * 100)) : 100;
  return { rank, next, levelNumber: idx + 1, xpIntoLevel, xpForLevel, progressPct };
}
