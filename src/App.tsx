import './amplify';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/AuthContext';
import { ProgressProvider, useProgressContext } from './hooks/ProgressContext';
import { AppGate } from './components/AppGate';
import { TopBar } from './components/TopBar';
import { AuthScreen } from './pages/AuthScreen';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { Learn } from './pages/Learn';
import { Mistakes } from './pages/Mistakes';
import { Exam } from './pages/Exam';
import { Settings } from './pages/Settings';
import { Dashboard } from './pages/Dashboard';

function OnboardingGate() {
  const { progress, loaded } = useProgressContext();

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center text-2xl text-slate-400">🚗</div>
    );
  }
  if (!progress.name) return <Onboarding />;

  return (
    <BrowserRouter>
      <TopBar />
      <main className="min-h-screen pb-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learn/:topicId/:lessonIndex" element={<Learn />} />
          <Route path="/mistakes" element={<Mistakes />} />
          <Route path="/exam" element={<Exam />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

function AuthenticatedApp() {
  return (
    <AppGate>
      <ProgressProvider>
        <OnboardingGate />
      </ProgressProvider>
    </AppGate>
  );
}

function Root() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-2xl text-slate-400">🚗</div>
    );
  }
  return user ? <AuthenticatedApp /> : <AuthScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}
