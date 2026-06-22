import { useState } from 'react';
import { useProgressContext } from '../hooks/ProgressContext';
import { useAuth } from '../hooks/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';

// Shown once, right after a new user's first login, to capture name + gender.
// Gender drives Hebrew grammar throughout the app.
export function Onboarding() {
  const { progress, setProfile } = useProgressContext();
  const { signOut } = useAuth();
  const [name, setName] = useState(progress.name); // prefilled for existing users
  const [gender, setGender] = useState<'f' | 'm' | null>(null);

  const ready = name.trim().length > 0 && gender !== null;
  const submit = () => {
    if (ready) setProfile(name.trim(), gender!);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 dark:bg-slate-900">
      {/* Top controls: logout + theme */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1">
        <button
          onClick={signOut}
          className="rounded-full px-3 py-1 text-base text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          יציאה
        </button>
        <ThemeToggle />
      </div>

      <div className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-500/10" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-500/10" />

      <div className="relative w-full max-w-md text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-emerald-500 text-4xl shadow-lg shadow-sky-500/30">
          👋
        </div>
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">ברוכים הבאים!</h1>
        <p className="mb-8 text-lg text-slate-500 dark:text-slate-400">כמה פרטים קטנים ומתחילים</p>

        <div className="rounded-3xl border border-slate-100 bg-white/90 p-7 shadow-xl shadow-slate-200/60 backdrop-blur dark:border-slate-700 dark:bg-slate-800/90 dark:shadow-black/30">
          <label className="mb-2 block text-right text-sm font-semibold text-slate-600 dark:text-slate-300">איך לקרוא לך?</label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            maxLength={20}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-2xl font-bold text-slate-800 transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:bg-slate-700"
            placeholder="השם שלך"
          />

          <label className="mt-5 mb-2 block text-right text-sm font-semibold text-slate-600 dark:text-slate-300">
            איך לפנות אליך?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setGender('f')}
              className={`rounded-2xl border-2 py-4 text-lg font-bold transition ${
                gender === 'f'
                  ? 'border-pink-400 bg-pink-50 text-pink-600 dark:bg-pink-500/15'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-pink-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              👩 בלשון נקבה
            </button>
            <button
              onClick={() => setGender('m')}
              className={`rounded-2xl border-2 py-4 text-lg font-bold transition ${
                gender === 'm'
                  ? 'border-sky-400 bg-sky-50 text-sky-600 dark:bg-sky-500/15'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-sky-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              👨 בלשון זכר
            </button>
          </div>

          <button
            onClick={submit}
            disabled={!ready}
            className="mt-6 w-full rounded-2xl bg-gradient-to-l from-sky-500 to-sky-600 py-4 text-lg font-bold text-white shadow-lg shadow-sky-500/30 transition hover:from-sky-600 hover:to-sky-700 disabled:opacity-40"
          >
            יאללה, מתחילים! 🚀
          </button>
        </div>

        <p className="mt-6 text-sm text-slate-400 dark:text-slate-500">נשתמש בזה רק כדי לדבר אליך נכון ולעודד בדרך 💛</p>
      </div>
    </div>
  );
}
