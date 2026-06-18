import { useState } from 'react';
import { useProgressContext } from '../hooks/ProgressContext';

// Shown once, right after a new user's first login, to capture their name.
export function Onboarding() {
  const { setName } = useProgressContext();
  const [value, setValue] = useState('');

  const submit = () => {
    const name = value.trim();
    if (name) setName(name);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4">
      <div className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />

      <div className="relative w-full max-w-md text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-emerald-500 text-4xl shadow-lg shadow-sky-500/30">
          👋
        </div>
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900">
          ברוכה הבאה!
        </h1>
        <p className="mb-8 text-lg text-slate-500">
          לפני שמתחילים — איך לקרוא לך?
        </p>

        <div className="rounded-3xl border border-slate-100 bg-white/90 p-7 shadow-xl shadow-slate-200/60 backdrop-blur">
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            maxLength={20}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-2xl font-bold text-slate-800 transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 focus:outline-none"
            placeholder="השם שלך"
          />
          <button
            onClick={submit}
            disabled={!value.trim()}
            className="mt-5 w-full rounded-2xl bg-gradient-to-l from-sky-500 to-sky-600 py-4 text-lg font-bold text-white shadow-lg shadow-sky-500/30 transition hover:from-sky-600 hover:to-sky-700 disabled:opacity-40"
          >
            יאללה, מתחילים! 🚀
          </button>
        </div>

        <p className="mt-6 text-sm text-slate-400">נשתמש בשם רק כדי לעודד אותך בדרך 💛</p>
      </div>
    </div>
  );
}
