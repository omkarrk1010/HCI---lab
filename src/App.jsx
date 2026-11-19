import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StudyProvider, useStudy } from './context/StudyContext';
import { EnvironmentBackground } from './components/EnvironmentBackground';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { FocusSessions } from './pages/FocusSessions';
import { Analytics } from './pages/Analytics';
import { ProcrastinationDashboard } from './pages/ProcrastinationDashboard';
import { StudyPersonality } from './pages/StudyPersonality';
import { SavedEnvironments } from './pages/SavedEnvironments';
import { HCILab } from './pages/HCILab';
import { Settings } from './pages/Settings';
import { AuthPage } from './pages/AuthPage';
import { AudioMixer } from './components/AudioMixer';
import { Sparkles, Loader2 } from 'lucide-react';

function StudyScapeApp() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const {
    currentTab,
    setCurrentTab,
    isMuted,
    toggleMute,
    pomoIsRunning,
    startPomo,
    pausePomo
  } = useStudy();

  const [showAudioMixer, setShowAudioMixer] = useState(false);

  // Global Keyboard Shortcuts (Shneiderman: Universal Usability & Accessibility)
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (pomoIsRunning) pausePomo();
        else startPomo();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 'Escape') {
        if (showAudioMixer) {
          setShowAudioMixer(false);
        } else if (currentTab === 'focus') {
          setCurrentTab('dashboard');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated, pomoIsRunning, isMuted, currentTab, showAudioMixer]);

  // Loading state while verifying cryptographic session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-6 animate-pulse">
          <Sparkles className="w-8 h-8 text-stone-50" />
        </div>
        <div className="flex items-center gap-2 text-stone-600 text-sm font-semibold tracking-wide">
          <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
          <span>Restoring study space...</span>
        </div>
        <p className="text-xs text-stone-400 mt-2 font-mono">Verifying secure credentials</p>
      </div>
    );
  }

  // Protected route enforcement: Unauthenticated users are redirected to AuthPage
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const isFocusMode = currentTab === 'focus';

  return (
    <div className="min-h-screen relative flex flex-col text-stone-800 selection:bg-amber-300/40">
      {/* Dynamic Immersive Background Photo & Atmosphere */}
      <EnvironmentBackground />

      {/* Main Top Navigation Header (Hidden in Pure Focus Mode) */}
      {!isFocusMode && <Navbar onOpenAudioMixer={() => setShowAudioMixer(true)} />}

      {/* Dynamic View Router */}
      <main className="flex-1 w-full">
        {currentTab === 'dashboard' && <Dashboard onOpenAudioMixer={() => setShowAudioMixer(true)} />}
        {currentTab === 'focus' && <FocusSessions onOpenAudioMixer={() => setShowAudioMixer(true)} />}
        {currentTab === 'analytics' && <Analytics />}
        {currentTab === 'procrastination' && <ProcrastinationDashboard />}
        {currentTab === 'personality' && <StudyPersonality />}
        {currentTab === 'environments' && <SavedEnvironments onOpenAudioMixer={() => setShowAudioMixer(true)} />}
        {currentTab === 'hci' && <HCILab />}
        {currentTab === 'settings' && <Settings />}
      </main>

      {/* Audio Mixer Modal */}
      <AudioMixer
        isOpen={showAudioMixer}
        onClose={() => setShowAudioMixer(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StudyProvider>
        <StudyScapeApp />
      </StudyProvider>
    </AuthProvider>
  );
}
