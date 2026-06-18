// Leitner system: 5 boxes. A correct answer promotes a card one box;
// a mistake sends it back to box 1. Higher box = longer interval.

export const NUM_BOXES = 5;

// Review intervals per box, in days.
const INTERVALS_DAYS = [0, 1, 3, 7, 16];

export interface CardState {
  box: number; // 1..5
  nextDue: number; // epoch ms
}

export function initialCard(): CardState {
  return { box: 1, nextDue: Date.now() };
}

export function review(card: CardState, correct: boolean): CardState {
  const box = correct ? Math.min(card.box + 1, NUM_BOXES) : 1;
  const intervalDays = INTERVALS_DAYS[box - 1];
  return { box, nextDue: Date.now() + intervalDays * 24 * 60 * 60 * 1000 };
}

export function isDue(card: CardState, now = Date.now()): boolean {
  return card.nextDue <= now;
}
