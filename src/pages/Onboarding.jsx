import { useState } from 'react';
import { useProgressContext } from '../hooks/useProgressContext';
import { useAuth } from '../hooks/useAuth';
import { ThemeToggle } from '../components/ThemeToggle';
import { Button } from '../components/Button';
import { LogoMark } from '../components/Logo';

const genderBase =
  'rounded-xl border-2 py-4 text-lg font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 dark:focus-visible:ring-sky-500/40';

// Shown once, right after a new user's first login, to capture name + gender.
// Gender drives Hebrew grammar throughout the app.
export function Onboarding() {
  const { progress, setProfile } = useProgressContext();
  const { signOut } = useAuth();
  const [name, setName] = useState(progress.name); // prefilled for existing users
  const [gender, setGender] = useState(null);

  const ready = name.trim().length > 0 && gender !== null;
  const submit = () => {
    if (ready) setProfile(name.trim(), gender);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-900">
      {/* Top controls: logout + theme */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={signOut}>
          יציאה
        </Button>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-5 flex justify-center">
          <LogoMark size={64} />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100">ברוכים הבאים!</h1>
        <p className="mb-8 text-lg text-slate-500 dark:text-slate-400">כמה פרטים קטנים ומתחילים</p>

        <div className="rounded-2xl border border-slate-200/70 bg-white p-7 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <label className="mb-2 block text-right text-sm font-semibold text-slate-600 dark:text-slate-300">איך לקרוא לך?</label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            maxLength={20}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-2xl font-bold text-slate-800 transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:focus:bg-slate-700"
            placeholder="השם שלך"
          />

          <label className="mt-5 mb-2 block text-right text-sm font-semibold text-slate-600 dark:text-slate-300">
            איך לפנות אליך?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setGender('f')}
              className={`${genderBase} ${
                gender === 'f'
                  ? 'border-pink-400 bg-pink-50 text-pink-600 dark:bg-pink-500/15'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-pink-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              👩 בלשון נקבה
            </button>
            <button
              onClick={() => setGender('m')}
              className={`${genderBase} ${
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
            className="mt-6 w-full rounded-xl bg-sky-600 py-4 text-lg font-bold text-white shadow-sm transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 dark:focus-visible:ring-sky-500/40 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
          >
            יאללה, מתחילים! 🚀
          </button>
        </div>

        <p className="mt-6 text-sm text-slate-400 dark:text-slate-500">נשתמש בזה רק כדי לדבר אליך נכון ולעודד בדרך 💛</p>
      </div>
    </div>
  );
}
