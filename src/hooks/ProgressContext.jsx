import { createContext, useContext } from 'react';
import { useProgress } from './useProgress';

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const api = useProgress();
  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

export function useProgressContext() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgressContext must be used within ProgressProvider');
  return ctx;
}
