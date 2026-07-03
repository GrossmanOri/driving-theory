import { useEffect, useState } from 'react';
import { fetchQuestions } from '../lib/api';
import { setQuestions } from '../data/loader';

// Loads the question bank from the API once, then renders the app.
export function AppGate({ children }) {
  const [state, setState] = useState('loading');

  const fetchBank = () =>
    fetchQuestions()
      .then((qs) => {
        setQuestions(qs);
        setState('ready');
      })
      .catch(() => setState('error'));

  const load = () => {
    setState('loading');
    fetchBank();
  };

  useEffect(() => {
    fetchBank();

  }, []);

  if (state === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-slate-500">
        <div className="text-5xl">🚗</div>
        <p className="text-xl">טוענים את השאלות…</p>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center text-slate-600">
        <div className="text-5xl">😕</div>
        <p className="text-xl">לא הצלחנו לטעון את השאלות.</p>
        <button onClick={load} className="rounded-2xl bg-sky-500 px-6 py-3 text-lg font-bold text-white">
          נסי שוב
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
