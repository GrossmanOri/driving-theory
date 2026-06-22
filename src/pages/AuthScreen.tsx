import { useState } from 'react';
import { signInWithRedirect } from 'aws-amplify/auth';
import { useAuth } from '../hooks/AuthContext';
import { GOOGLE_ENABLED } from '../config';

type Mode = 'signIn' | 'signUp' | 'confirm';

function friendlyError(e: unknown): string {
  const name = (e as { name?: string })?.name || '';
  const msg = (e as { message?: string })?.message || '';
  if (name === 'UserNotConfirmedException') return 'צריך לאמת את המייל קודם — שלחנו לך קוד.';
  if (name === 'NotAuthorizedException') return 'אימייל או סיסמה לא נכונים. כדאי לנסות שוב 💛';
  if (name === 'UsernameExistsException') return 'כבר קיים חשבון עם המייל הזה. אפשר להתחבר.';
  if (name === 'CodeMismatchException') return 'הקוד לא נכון. כדאי לבדוק שוב את המייל.';
  if (name === 'InvalidPasswordException' || /password/i.test(msg))
    return 'הסיסמה צריכה לפחות 8 תווים, עם אות גדולה, אות קטנה, מספר וסימן.';
  if (name === 'LimitExceededException') return 'יותר מדי ניסיונות. כדאי לחכות רגע.';
  return msg || 'משהו השתבש. ננסה שוב?';
}

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"
    />
  </svg>
);

export function AuthScreen() {
  const { signIn, signUp, confirm, resend, refresh } = useAuth();
  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError('');
    setInfo('');
    try {
      await fn();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  const onSignIn = () => run(() => signIn(email.trim(), password));
  const onSignUp = () =>
    run(async () => {
      await signUp(email.trim(), password);
      setInfo('שלחנו קוד אימות למייל שלך 📧 (אם לא רואים — כדאי לבדוק בספאם)');
      setMode('confirm');
    });
  const onConfirm = () =>
    run(async () => {
      await confirm(email.trim(), code.trim());
      if (password) await signIn(email.trim(), password);
      else {
        setInfo('המייל אומת! אפשר להתחבר.');
        setMode('signIn');
      }
      await refresh();
    });
  const onGoogle = () => signInWithRedirect({ provider: 'Google' });

  const title =
    mode === 'signUp' ? 'יוצרים חשבון חדש' : mode === 'confirm' ? 'אימות המייל' : 'כיף שחזרת!';
  const subtitle =
    mode === 'confirm'
      ? `הקוד נשלח אל ${email}`
      : 'הדרך הכי נעימה ללמוד לתיאוריה';

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10">
      {/* soft brand background */}
      <div className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="mb-7 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 text-3xl shadow-lg shadow-sky-500/30">
            🚗
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">לומדים תיאוריה</h1>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white/90 p-7 shadow-xl shadow-slate-200/60 backdrop-blur">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
            <p className="mt-1 text-base text-slate-500">{subtitle}</p>
          </div>

          {/* Google */}
          {mode !== 'confirm' && GOOGLE_ENABLED && (
            <>
              <button
                onClick={onGoogle}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white py-3.5 text-lg font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <GoogleIcon />
                המשך עם Google
              </button>
              <div className="my-5 flex items-center gap-3 text-sm text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                או עם אימייל
                <span className="h-px flex-1 bg-slate-200" />
              </div>
            </>
          )}

          {mode !== 'confirm' && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-600">אימייל</label>
                <input
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-lg text-slate-800 transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 focus:outline-none"
                  placeholder="name@example.com"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-600">סיסמה</label>
                <input
                  type="password"
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (mode === 'signIn' ? onSignIn() : onSignUp())}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-lg text-slate-800 transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 focus:outline-none"
                  placeholder="••••••••"
                />
                {mode === 'signUp' && (
                  <p className="mt-1.5 text-xs text-slate-400">
                    לפחות 8 תווים, עם אות גדולה, אות קטנה, מספר וסימן.
                  </p>
                )}
              </div>
            </div>
          )}

          {mode === 'confirm' && (
            <div className="flex flex-col gap-3">
              <input
                type="text"
                dir="ltr"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-3xl tracking-[0.4em] text-slate-800 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 focus:outline-none"
                placeholder="------"
              />
              <p className="rounded-xl bg-sky-50 px-4 py-3 text-center text-sm text-sky-700">
                📨 לא רואים את המייל? כדאי לבדוק בתיקיית הספאם / "דואר זבל" — לפעמים הוא מגיע לשם.
              </p>
              <button
                onClick={() => run(() => resend(email.trim()).then(() => setInfo('שלחנו קוד חדש 📧')))}
                className="text-sm font-semibold text-sky-600 hover:underline"
              >
                לא קיבלתי — שלחו לי קוד שוב
              </button>
            </div>
          )}

          {error && (
            <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-center text-sm text-amber-700">{error}</p>
          )}
          {info && (
            <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-700">{info}</p>
          )}

          <button
            onClick={mode === 'signIn' ? onSignIn : mode === 'signUp' ? onSignUp : onConfirm}
            disabled={busy}
            className="mt-6 w-full rounded-2xl bg-gradient-to-l from-sky-500 to-sky-600 py-4 text-lg font-bold text-white shadow-lg shadow-sky-500/30 transition hover:from-sky-600 hover:to-sky-700 disabled:opacity-50"
          >
            {busy ? 'רגע…' : mode === 'signIn' ? 'התחברות' : mode === 'signUp' ? 'יצירת חשבון' : 'אישור'}
          </button>

          {mode !== 'confirm' && (
            <p className="mt-5 text-center text-sm text-slate-500">
              {mode === 'signIn' ? 'אין לך חשבון עדיין? ' : 'כבר יש לך חשבון? '}
              <button
                onClick={() => {
                  setMode(mode === 'signIn' ? 'signUp' : 'signIn');
                  setError('');
                  setInfo('');
                }}
                className="font-bold text-sky-600 hover:underline"
              >
                {mode === 'signIn' ? 'להרשמה' : 'להתחברות'}
              </button>
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          בלי לחץ, בקצב שלך 💛
        </p>
      </div>
    </div>
  );
}
