import { useEffect, useState } from 'react';
import { fetchQuestions } from '../lib/api';
import { setQuestions } from '../data/loader';
import { LoadingScreen } from './Loading';
import { Card } from './Card';
import { Button } from './Button';
import { IconAlert, IconRotate } from './Icons';

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
    return <LoadingScreen label="טוענים את השאלות…" />;
  }

  if (state === 'error') {
    return (
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-4">
        <Card className="w-full text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
            <IconAlert size={36} />
          </div>
          <p className="mb-6 text-xl text-slate-700 dark:text-slate-200">לא הצלחנו לטעון את השאלות.</p>
          <Button onClick={load} size="lg">
            <IconRotate size={22} />
            נסי שוב
          </Button>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
