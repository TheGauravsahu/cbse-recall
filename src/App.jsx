import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useThemeStore } from './stores/themeStore';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import Landing from './pages/Landing';
import Subjects from './pages/Subjects';
import SubjectDetails from './pages/SubjectDetails';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import Review from './pages/Review';

// V2 Feature Modular Components
import Dashboard from './features/dashboard/Dashboard';
import SpacedRepetition from './features/revision/SpacedRepetition';
import FormulasCenter from './features/formulas/FormulasCenter';
import ProfilePanel from './features/profile/ProfilePanel';
import SettingsPanel from './features/settings/SettingsPanel';

export default function App() {
  const { initTheme } = useThemeStore();

  useEffect(() => {
    // Resolve dark/light class selections from store
    initTheme();
  }, []);

  return (
    <BrowserRouter>
      {/* Container wraps and padding offsets to avoid bottom-nav clipping on mobile */}
      <div className="min-h-screen bg-bg-light text-primary transition-colors duration-300 dark:bg-bg-dark dark:text-slate-100 flex flex-col pb-16 md:pb-0">
        
        {/* Sticky Desktop/Mobile Header */}
        <Navbar />
        
        {/* Routing Arena */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/subject/:subjectId" element={<SubjectDetails />} />
            <Route path="/quiz/:subjectId/:chapterId" element={<Quiz />} />
            <Route path="/result/:attemptId" element={<Results />} />
            <Route path="/review/:attemptId" element={<Review />} />
            <Route path="/revision" element={<SpacedRepetition />} />
            <Route path="/formulas" element={<FormulasCenter />} />
            <Route path="/profile" element={<ProfilePanel />} />
            <Route path="/settings" element={<SettingsPanel />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

        {/* Sticky Mobile Footer Nav */}
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
