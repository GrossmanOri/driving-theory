import { useState } from 'react';
import { useProgressContext } from '../hooks/useProgressContext';
import { useAuth } from '../hooks/useAuth';
import { speak, speechSupported } from '../lib/speech';
import { useTheme } from '../hooks/useTheme';
import { soundEnabled, setSoundEnabled, playCorrect } from '../lib/sound';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { IconLogOut, IconMoon, IconSettings, IconSun, IconVolume } from '../components/Icons';

const SIZES = [
  { label: 'רגיל', px: 18 },
  { label: 'גדול', px: 21 },
  { label: 'גדול מאוד', px: 24 },
];

const THEMES = [
  { label: 'אוטומטי', value: 'system', Icon: IconSettings },
  { label: 'בהיר', value: 'light', Icon: IconSun },
  { label: 'כהה', value: 'dark', Icon: IconMoon },
];

export function Settings() {
  const { progress, setFontSize } = useProgressContext();
  const { signOut } = useAuth();
  const { theme, set: setTheme } = useTheme();
  const [sound, setSound] = useState(soundEnabled());
  const current = progress.settings.fontSizePx;

  const h2Cls = 'mb-3 text-lg font-bold text-slate-700 dark:text-slate-200';
  const optBase =
    'flex flex-1 items-center justify-center gap-2 rounded-xl border py-4 font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 dark:focus-visible:ring-sky-500/40';
  const optOn = 'border-sky-600 bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300';
  const optOff =
    'border-slate-200 bg-white text-slate-600 hover:border-sky-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300';

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-5 text-2xl font-bold text-slate-800 dark:text-slate-100">הגדרות</h1>

      {/* Theme */}
      <Card className="mb-5">
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
              <t.Icon size={18} /> {t.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Sound */}
      <Card className="mb-5">
        <h2 className={h2Cls}>צלילים ורטט</h2>
        <label className="flex items-center justify-between">
          <span className="text-lg text-slate-600 dark:text-slate-300">צלילי עידוד ורטט קטן</span>
          <button
            type="button"
            role="switch"
            aria-checked={sound}
            aria-label="צלילי עידוד ורטט"
            onClick={() => {
              const next = !sound;
              setSound(next);
              setSoundEnabled(next);
              if (next) playCorrect();
            }}
            className={`h-8 w-14 rounded-full transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 dark:focus-visible:ring-sky-500/40 ${sound ? 'bg-green-400' : 'bg-slate-300 dark:bg-slate-600'}`}
          >
            <span
              className={`block h-7 w-7 rounded-full bg-white shadow transition ${sound ? 'translate-x-0' : '-translate-x-6'}`}
            />
          </button>
        </label>
      </Card>

      {/* Text size */}
      <Card className="mb-5">
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
      </Card>

      {/* Read-aloud */}
      <Card className="mb-5">
        <h2 className="mb-2 text-lg font-bold text-slate-700 dark:text-slate-200">הקראה בקול</h2>
        {speechSupported() ? (
          <>
            <p className="mb-3 flex flex-wrap items-center gap-1 text-base text-slate-500 dark:text-slate-400">
              בכל שאלה והסבר יש כפתור <IconVolume size={18} className="inline" /> שמקריא את הטקסט בעברית.
            </p>
            <Button variant="secondary" size="sm" onClick={() => speak('שלום! ככה נשמעת ההקראה.')}>
              <IconVolume size={18} /> לשמוע דוגמה
            </Button>
          </>
        ) : (
          <p className="text-base text-slate-500 dark:text-slate-400">הדפדפן הזה לא תומך בהקראה בקול.</p>
        )}
      </Card>

      {/* Motion */}
      <Card className="mb-5">
        <h2 className="mb-2 text-lg font-bold text-slate-700 dark:text-slate-200">תנועה ואנימציות</h2>
        <p className="text-base text-slate-500 dark:text-slate-400">
          האפליקציה מכבדת את הגדרת ה"הפחתת תנועה" של המכשיר שלך — אם היא מופעלת,
          הקונפטי והאנימציות יהיו עדינים יותר.
        </p>
      </Card>

      {/* Account */}
      <Card>
        <h2 className="mb-3 text-lg font-bold text-slate-700 dark:text-slate-200">חשבון</h2>
        <Button variant="secondary" size="sm" onClick={signOut}>
          <IconLogOut size={18} /> התנתקות
        </Button>
      </Card>
    </div>
  );
}
