import React, { useState, useEffect } from 'react';
import { StudyProvider, useStudy } from './context/StudyContext';
import { EnvironmentBackground } from './components/EnvironmentBackground';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { FocusSessions } from './pages/FocusSessions';
import { Analytics } from './pages/Analytics';
import { SavedEnvironments } from './pages/SavedEnvironments';
import { HCILab } from './pages/HCILab';
import { Settings } from './pages/Settings';
import { AudioMixer } from './components/AudioMixer';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

function StudyScapeApp() {
  const { 
    currentTab, 
    setCurrentTab, 
    activeSounds, 
    isMuted, 
    toggleMute,
    pomoIsRunning,
    startPomo,
    pausePomo
  } = useStudy();

  const [showAudioMixer, setShowAudioMixer] = useState(false);

  // Global Keyboard Shortcuts (Shneiderman: Universal Usability & Accessibility)
  useEffect(() => {
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
        setShowAudioMixer(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pomoIsRunning, isMuted]);

  const isAudioPlaying = activeSounds.length > 0 && !isMuted;

  return (
    <div className="min-h-screen relative flex flex-col text-stone-100 selection:bg-amber-500/30">
      {/* Dynamic Immersive Background Photo & Atmosphere */}
      <EnvironmentBackground />

      {/* Main Top Navigation Header */}
      <Navbar onOpenAudioMixer={() => setShowAudioMixer(true)} />

      {/* Dynamic View Router */}
      <div className="flex-1 w-full">
        {currentTab === 'dashboard' && <Dashboard onOpenAudioMixer={() => setShowAudioMixer(true)} />}
        {currentTab === 'focus' && <FocusSessions onOpenAudioMixer={() => setShowAudioMixer(true)} />}
        {currentTab === 'analytics' && <Analytics />}
        {currentTab === 'environments' && <SavedEnvironments onOpenAudioMixer={() => setShowAudioMixer(true)} />}
        {currentTab === 'hci' && <HCILab />}
        {currentTab === 'settings' && <Settings />}
      </div>

      {/* Floating Bottom Ambient Sound Dock Button */}
      <aside 
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2"
        aria-label="Quick Audio Controls"
      >
        <button
          onClick={() => setShowAudioMixer(true)}
          className={`px-4 py-2.5 rounded-2xl glass-panel border flex items-center gap-2.5 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${
            isAudioPlaying
              ? 'border-amber-400/80 bg-stone-900/90 text-amber-300 ring-2 ring-amber-400/30'
              : 'border-white/15 bg-stone-900/80 text-stone-300 hover:text-white'
          }`}
          aria-label="Open Ambient Sound Studio"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-400" />
          ) : (
            <Volume2 className={`w-4 h-4 ${isAudioPlaying ? 'text-amber-400 animate-pulse' : ''}`} />
          )}
          <span className="text-xs font-bold tracking-tight">
            {activeSounds.length > 0 ? `${activeSounds.length} Sounds Active` : 'Ambient Studio'}
          </span>
          {isAudioPlaying && (
            <span className="flex items-center gap-0.5 ml-1">
              <span className="w-1 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-4 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          )}
        </button>
      </aside>

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
    <StudyProvider>
      <StudyScapeApp />
    </StudyProvider>
  );
}
