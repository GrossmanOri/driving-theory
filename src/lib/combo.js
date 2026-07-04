// Session-scoped "combo" counter — consecutive first-try-correct answers.
// Module state only: it lives for the browser tab, resets on wrong answers,
// and never persists to storage or across pages beyond the running session.

let count = 0;

export function bump() {
  count += 1;
  return count;
}

export function reset() {
  count = 0;
}

export function current() {
  return count;
}

// Escalating milestones. `bonus` (extra points) is awarded via onBonus in
// QuestionCard when a callback is available. Strings are the celebratory
// Hebrew copy shown in the center-screen ComboToast.
export const COMBO_TIERS = {
  2: { text: '2 ברצף! ⚡', bonus: 0 },
  3: { text: '3 ברצף! 🔥', bonus: 0 },
  5: { text: '5 ברצף! 🚀 +5 בונוס', bonus: 5 },
  8: { text: '8 ברצף! 👑 +10 בונוס', bonus: 10 },
  12: { text: '12 ברצף! 🤯 +20 בונוס', bonus: 20 },
};

export function comboTier(n) {
  return COMBO_TIERS[n] || null;
}
