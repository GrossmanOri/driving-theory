import { useState } from 'react';
import { useAuth } from '../hooks/AuthContext';

type Mode = 'signIn' | 'signUp' | 'confirm';

// Friendly Hebrew messages for the most common Cognito errors.
function friendlyError(e: unknown): string {
  const name = (e as { name?: string })?.name || '';
  const msg = (e as { message?: string })?.message || '';
  if (name === 'UserNotConfirmedException') return 'צריך לאמת את המייל קודם — שלחנו לך קוד.';
  if (name === 'NotAuthorizedException') return 'אימייל או סיסמה לא נכונים. נסי שוב 💛';
  if (name === 'UsernameExistsException') return 'כבר קיים חשבון עם המייל הזה. אפשר להתחבר.';
  if (name === 'CodeMismatchException') return 'הקוד לא נכון. בדקי שוב את המייל.';
  if (name === 'InvalidPasswordException' || /password/i.test(msg))
    return 'הסיסמה צריכה לפחות 8 תווים, עם אות גדולה, אות קטנה, מספר וסימן.';
  if (name === 'LimitExceededException') return 'יותר מדי ניסיונות. כדאי לחכות רגע.';
  return msg || 'משהו השתבש. ננסה שוב?';
}

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
      setInfo('שלחנו קוד אימות למייל שלך 📧');
      setMode('confirm');
    });
  const onConfirm = () =>
    run(async () => {
      await confirm(email.trim(), code.trim());
      // Auto sign-in after confirming, if we still have the password.
      if (password) await signIn(email.trim(), password);
      else {
        setInfo('המייל אומת! אפשר להתחבר.');
        setMode('signIn');
      }
      await refresh();
    });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-50 to-white px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <div className="mb-2 text-5xl">🚗</div>
          <h1 className="text-3xl font-extrabold text-slate-800">לומדים תיאוריה</h1>
          <p className="mt-1 text-lg text-slate-500">
            {mode === 'signUp' ? 'יוצרים חשבון חדש' : mode === 'confirm' ? 'אימות המייל' : 'כיף שחזרת!'}
          </p>
        </div>

        {mode !== 'confirm' && (
          <div className="flex flex-col gap-3">
            <label className="text-base font-semibold text-slate-600">אימייל</label>
            <input
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-2xl border-2 border-slate-200 px-4 py-3 text-lg focus:border-sky-400 focus:outline-none"
              placeholder="name@example.com"
            />
            <label className="mt-2 text-base font-semibold text-slate-600">סיסמה</label>
            <input
              type="password"
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-2xl border-2 border-slate-200 px-4 py-3 text-lg focus:border-sky-400 focus:outline-none"
              placeholder="••••••••"
            />
            {mode === 'signUp' && (
              <p className="text-sm text-slate-400">
                לפחות 8 תווים, עם אות גדולה, אות קטנה, מספר וסימן.
              </p>
            )}
          </div>
        )}

        {mode === 'confirm' && (
          <div className="flex flex-col gap-3">
            <p className="text-base text-slate-600">הכניסי את הקוד שקיבלת במייל ({email}):</p>
            <input
              type="text"
              dir="ltr"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="rounded-2xl border-2 border-slate-200 px-4 py-3 text-center text-2xl tracking-widest focus:border-sky-400 focus:outline-none"
              placeholder="123456"
            />
            <button
              onClick={() => run(() => resend(email.trim()).then(() => setInfo('שלחנו קוד חדש 📧')))}
              className="text-base text-sky-600 hover:underline"
            >
              לא קיבלתי — שלחו לי קוד שוב
            </button>
          </div>
        )}

        {error && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-center text-amber-700">{error}</p>}
        {info && <p className="mt-4 rounded-xl bg-green-50 p-3 text-center text-green-700">{info}</p>}

        <button
          onClick={mode === 'signIn' ? onSignIn : mode === 'signUp' ? onSignUp : onConfirm}
          disabled={busy}
          className="mt-6 w-full rounded-2xl bg-sky-500 py-4 text-xl font-bold text-white shadow-md transition hover:bg-sky-600 disabled:opacity-50"
        >
          {busy ? 'רגע…' : mode === 'signIn' ? 'התחברות' : mode === 'signUp' ? 'יצירת חשבון' : 'אישור'}
        </button>

        {mode !== 'confirm' && (
          <p className="mt-5 text-center text-base text-slate-500">
            {mode === 'signIn' ? 'אין לך חשבון עדיין? ' : 'כבר יש לך חשבון? '}
            <button
              onClick={() => {
                setMode(mode === 'signIn' ? 'signUp' : 'signIn');
                setError('');
                setInfo('');
              }}
              className="font-bold text-sky-600 hover:underline"
            >
              {mode === 'signIn' ? 'הרשמה' : 'התחברות'}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
