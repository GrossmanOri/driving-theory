import './amplify';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/AuthContext';
import { ProgressProvider, useProgressContext } from './hooks/ProgressContext';
import { AppGate } from './components/AppGate';
import { setGender } from './lib/gender';
import { TopBar } from './components/TopBar';
import { LevelUpCelebration } from './components/LevelUpCelebration';
import { AuthScreen } from './pages/AuthScreen';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { Learn } from './pages/Learn';
import { Mistakes } from './pages/Mistakes';
import { Exam } from './pages/Exam';
import { Settings } from './pages/Settings';
import { Dashboard } from './pages/Dashboard';
import { Collection } from './pages/Collection';
import { Review } from './pages/Review';
import { QuickPractice } from './pages/QuickPractice';
import { Blitz } from './pages/Blitz';
import { Flashcards } from './pages/Flashcards';
import { Focus } from './pages/Focus';
import { DailyChallenge } from './pages/DailyChallenge';

function OnboardingGate() {
  const { progress, loaded } = useProgressContext();

  // Drive Hebrew grammar from the user's gender before any page renders.
  setGender(progress.gender);

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center text-2xl text-slate-400">🚗</div>
    );
  }
  if (!progress.name || !progress.gender) return <Onboarding />;

  return (
    <BrowserRouter>
      <LevelUpCelebration />
      <TopBar />
      <main className="min-h-screen pb-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/learn/:topicId/:lessonIndex" element={<Learn />} />
          <Route path="/mistakes" element={<Mistakes />} />
          <Route path="/review" element={<Review />} />
          <Route path="/practice" element={<QuickPractice />} />
          <Route path="/blitz" element={<Blitz />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/daily" element={<DailyChallenge />} />
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
