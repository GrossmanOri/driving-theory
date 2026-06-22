// Time-of-day Hebrew greeting, optionally personalized with a name.
export function greeting(name?: string): string {
  const h = new Date().getHours();
  const base = h < 12 ? 'בוקר טוב' : h < 18 ? 'צהריים טובים' : 'ערב טוב';
  return name ? `${base}, ${name}` : base;
}

// A short rotating word of encouragement (kept positive, never pressuring).
import { gw } from './gender';

export function cheer(seed = 0): string {
  const cheers = [
    'כל יום של תרגול מקרב אותך לרישיון 🚗',
    'אין לחץ — בקצב שלך 💛',
    'גם חמש דקות זה התקדמות 🌱',
    gw('את לומדת מצוין, ממשיכים 💪', 'אתה לומד מצוין, ממשיכים 💪'),
  ];
  return cheers[seed % cheers.length];
}
