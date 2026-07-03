import './amplify';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthContext';
import { useAuth } from './hooks/useAuth';
import { ProgressProvider } from './hooks/ProgressContext';
import { useProgressContext } from './hooks/useProgressContext';
import { AppGate } from './components/AppGate';
import { setGender } from './lib/gender';
import { TopBar } from './components/TopBar';
import { LevelUpCelebration } from './components/LevelUpCelebration';
import { LoadingScreen } from './components/Loading';
import { AuthScreen } from './pages/AuthScreen';
import { Onboarding } from './pages/Onboarding';

const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const Collection = lazy(() => import('./pages/Collection').then((m) => ({ default: m.Collection })));
const Learn = lazy(() => import('./pages/Learn').then((m) => ({ default: m.Learn })));
const Mistakes = lazy(() => import('./pages/Mistakes').then((m) => ({ default: m.Mistakes })));
const Review = lazy(() => import('./pages/Review').then((m) => ({ default: m.Review })));
const QuickPractice = lazy(() => import('./pages/QuickPractice').then((m) => ({ default: m.QuickPractice })));
const Blitz = lazy(() => import('./pages/Blitz').then((m) => ({ default: m.Blitz })));
const Flashcards = lazy(() => import('./pages/Flashcards').then((m) => ({ default: m.Flashcards })));
const Focus = lazy(() => import('./pages/Focus').then((m) => ({ default: m.Focus })));
const DailyChallenge = lazy(() => import('./pages/DailyChallenge').then((m) => ({ default: m.DailyChallenge })));
const Exam = lazy(() => import('./pages/Exam').then((m) => ({ default: m.Exam })));
const Settings = lazy(() => import('./pages/Settings').then((m) => ({ default: m.Settings })));
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));

function AppRoutes() {
  const location = useLocation();
  return (
    <Suspense fallback={<LoadingScreen />}>
      <div key={location.pathname} className="animate-page-in">
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Suspense>
  );
}

function OnboardingGate() {
  const { progress, loaded } = useProgressContext();

  // Drive Hebrew grammar from the user's gender before any page renders.
  setGender(progress.gender);

  if (!loaded) {
    return <LoadingScreen label="טוענים…" />;
  }
  if (!progress.name || !progress.gender) return <Onboarding />;

  return (
    <BrowserRouter>
      <div className="relative min-h-screen overflow-x-hidden">
        {/* Soft gradient blobs behind the app shell (desktop breathing room) */}
        <div className="pointer-events-none fixed -top-32 -right-24 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-500/10" />
        <div className="pointer-events-none fixed -bottom-32 -left-24 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-500/10" />
        <div className="relative z-10">
          <LevelUpCelebration />
          <TopBar />
          <main className="min-h-screen pb-12">
            <AppRoutes />
          </main>
        </div>
      </div>
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
    return <LoadingScreen label="טוענים…" />;
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
