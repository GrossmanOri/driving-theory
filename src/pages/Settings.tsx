import { useProgressContext } from '../hooks/ProgressContext';
import { speak, speechSupported } from '../lib/speech';

const SIZES = [
  { label: 'רגיל', px: 18 },
  { label: 'גדול', px: 21 },
  { label: 'גדול מאוד', px: 24 },
];

export function Settings() {
  const { progress, setFontSize } = useProgressContext();
  const current = progress.settings.fontSizePx;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-5 text-3xl font-extrabold text-slate-800">הגדרות</h1>

      <section className="mb-5 rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-xl font-bold text-slate-700">גודל הטקסט</h2>
        <div className="flex gap-3">
          {SIZES.map((s) => (
            <button
              key={s.px}
              onClick={() => setFontSize(s.px)}
              className={`flex-1 rounded-2xl border-2 py-4 font-bold transition ${
                current === s.px
                  ? 'border-sky-400 bg-sky-50 text-sky-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-sky-200'
              }`}
              style={{ fontSize: `${s.px}px` }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-5 rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-xl font-bold text-slate-700">הקראה בקול</h2>
        {speechSupported() ? (
          <>
            <p className="mb-3 text-base text-slate-500">
              בכל שאלה והסבר יש כפתור 🔊 שמקריא את הטקסט בעברית.
            </p>
            <button
              onClick={() => speak('שלום! ככה נשמעת ההקראה.')}
              className="rounded-2xl bg-sky-50 px-5 py-3 text-lg font-bold text-sky-700 hover:bg-sky-100"
            >
              🔊 לשמוע דוגמה
            </button>
          </>
        ) : (
          <p className="text-base text-slate-500">הדפדפן הזה לא תומך בהקראה בקול.</p>
        )}
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-xl font-bold text-slate-700">תנועה ואנימציות</h2>
        <p className="text-base text-slate-500">
          האפליקציה מכבדת את הגדרת ה"הפחתת תנועה" של המכשיר שלך — אם היא מופעלת,
          הקונפטי והאנימציות יהיו עדינים יותר.
        </p>
      </section>
    </div>
  );
}
