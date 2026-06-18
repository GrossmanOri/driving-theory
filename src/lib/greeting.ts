// Time-of-day Hebrew greeting, optionally personalized with a name.
export function greeting(name?: string): string {
  const h = new Date().getHours();
  const base = h < 12 ? 'בוקר טוב' : h < 18 ? 'צהריים טובים' : 'ערב טוב';
  return name ? `${base}, ${name}` : base;
}

// A short rotating word of encouragement (kept positive, never pressuring).
const CHEERS = [
  'כל יום של תרגול מקרב אותך לרישיון 🚗',
  'אין לחץ — בקצב שלך 💛',
  'גם חמש דקות זה התקדמות 🌱',
  'את לומדת מצוין, ממשיכים 💪',
];

export function cheer(seed = 0): string {
  return CHEERS[seed % CHEERS.length];
}
