import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProgressProvider } from './hooks/ProgressContext';
import { TopBar } from './components/TopBar';
import { Home } from './pages/Home';
import { Learn } from './pages/Learn';
import { Mistakes } from './pages/Mistakes';
import { Exam } from './pages/Exam';
import { Settings } from './pages/Settings';

function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <TopBar />
        <main className="min-h-screen pb-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn/:topicId/:lessonIndex" element={<Learn />} />
            <Route path="/mistakes" element={<Mistakes />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </BrowserRouter>
    </ProgressProvider>
  );
}

export default App;
