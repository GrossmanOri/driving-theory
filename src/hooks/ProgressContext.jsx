import { useProgress } from './useProgress';
import { ProgressContext } from './useProgressContext';

export function ProgressProvider({ children }) {
  const api = useProgress();
  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}
