import { useState } from 'react';
import { useProgressContext } from '../hooks/ProgressContext';
import { speak, speechSupported } from '../lib/speech';
import { useTheme } from '../hooks/useTheme';
import { soundEnabled, setSoundEnabled, playCorrect } from '../lib/sound';

const SIZES = [
  { label: 'רגיל', px: 18 },
  { label: 'גדול', px: 21 },
  { label: 'גדול מאוד', px: 24 },
];

const THEMES = [
  { label: 'אוטומטי', value: 'system', icon: '🖥️' },
  { label: 'בהיר', value: 'light', icon: '☀️' },
  { label: 'כהה', value: 'dark', icon: '🌙' },
];

export function Settings() {
  const { progress, setFontSize } = useProgressContext();
  const { theme, set: setTheme } = useTheme();
  const [sound, setSound] = useState(soundEnabled());
  const current = progress.settings.fontSizePx;

  const cardCls = 'mb-5 rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-800 dark:shadow-black/30';
  const h2Cls = 'mb-3 text-xl font-bold text-slate-700 dark:text-slate-200';
  const optBase = 'flex-1 rounded-2xl border-2 py-4 font-bold transition';
  const optOn = 'border-sky-400 bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300';
  const optOff =
    'border-slate-200 bg-white text-slate-600 hover:border-sky-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300';

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-5 text-3xl font-extrabold text-slate-800 dark:text-slate-100">הגדרות</h1>

      {/* Theme */}
      <section className={cardCls}>
        <h2 className={h2Cls}>מראה</h2>
        <p className="mb-3 text-base text-slate-500 dark:text-slate-400">
          "אוטומטי" עוקב אחרי המכשיר/הדפדפן שלך ומתחלף יחד איתו.
        </p>
        <div className="flex gap-3">
          {THEMES.map((t) => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={`${optBase} ${theme === t.value ? optOn : optOff}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* Sound */}
      <section className={cardCls}>
        <h2 className={h2Cls}>צלילים ורטט</h2>
        <label className="flex items-center justify-between">
          <span className="text-lg text-slate-600 dark:text-slate-300">צלילי עידוד ורטט קטן</span>
          <button
            onClick={() => {
              const next = !sound;
              setSound(next);
              setSoundEnabled(next);
              if (next) playCorrect();
            }}
            className={`h-8 w-14 rounded-full transition ${sound ? 'bg-green-400' : 'bg-slate-300 dark:bg-slate-600'}`}
          >
            <span
              className={`block h-7 w-7 rounded-full bg-white shadow transition ${sound ? 'translate-x-0' : '-translate-x-6'}`}
            />
          </button>
        </label>
      </section>

      {/* Text size */}
      <section className={cardCls}>
        <h2 className={h2Cls}>גודל הטקסט</h2>
        <div className="flex gap-3">
          {SIZES.map((s) => (
            <button
              key={s.px}
              onClick={() => setFontSize(s.px)}
              className={`${optBase} ${current === s.px ? optOn : optOff}`}
              style={{ fontSize: `${s.px}px` }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </section>

      {/* Read-aloud */}
      <section className={cardCls}>
        <h2 className="mb-2 text-xl font-bold text-slate-700 dark:text-slate-200">הקראה בקול</h2>
        {speechSupported() ? (
          <>
            <p className="mb-3 text-base text-slate-500 dark:text-slate-400">
              בכל שאלה והסבר יש כפתור 🔊 שמקריא את הטקסט בעברית.
            </p>
            <button
              onClick={() => speak('שלום! ככה נשמעת ההקראה.')}
              className="rounded-2xl bg-sky-50 px-5 py-3 text-lg font-bold text-sky-700 hover:bg-sky-100 dark:bg-sky-500/15 dark:text-sky-300"
            >
              🔊 לשמוע דוגמה
            </button>
          </>
        ) : (
          <p className="text-base text-slate-500 dark:text-slate-400">הדפדפן הזה לא תומך בהקראה בקול.</p>
        )}
      </section>

      {/* Motion */}
      <section className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-800 dark:shadow-black/30">
        <h2 className="mb-2 text-xl font-bold text-slate-700 dark:text-slate-200">תנועה ואנימציות</h2>
        <p className="text-base text-slate-500 dark:text-slate-400">
          האפליקציה מכבדת את הגדרת ה"הפחתת תנועה" של המכשיר שלך — אם היא מופעלת,
          הקונפטי והאנימציות יהיו עדינים יותר.
        </p>
      </section>
    </div>
  );
}
