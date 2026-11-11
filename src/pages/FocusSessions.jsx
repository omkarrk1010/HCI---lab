import React, { useState, useEffect, useRef } from 'react';
import { useStudy } from '../context/StudyContext';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { StudyClock } from '../components/StudyClock';
import { 
  ArrowLeft, 
  Clock, 
  Flame, 
  Volume2, 
  VolumeX, 
  SlidersHorizontal
} from 'lucide-react';

export function FocusSessions({ onOpenAudioMixer }) {
  const { 
    currentEnvironment, 
    setCurrentTab,
    isMuted,
    toggleMute,
    activeSounds,
    masterVolume,
    handleMasterVolumeChange,
    pomoIsRunning
  } = useStudy();

  const [focusView, setFocusView] = useState('timer'); // 'timer' | 'clock'
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const fadeTimeoutRef = useRef(null);

  // Reliable Escape key listener to exit Focus Mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setCurrentTab('dashboard');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCurrentTab]);

  // Handle auto-fade after timer starts and reveal upon user interaction
  useEffect(() => {
    // If timer is paused, reset, or stopped: keep controls visible
    if (!pomoIsRunning) {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = null;
      }
      setControlsVisible(true);
      return;
    }

    // Timer is running: wait 2.5s (2–3 seconds window), then smoothly fade out controls
    const scheduleFadeOut = () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
      fadeTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 2500);
    };

    setControlsVisible(true);
    scheduleFadeOut();

    // Reset inactivity timer on any mouse, keyboard, or touch interaction
    const handleUserInteraction = () => {
      setControlsVisible(true);
      scheduleFadeOut();
    };

    window.addEventListener('mousemove', handleUserInteraction, { passive: true });
    window.addEventListener('mousedown', handleUserInteraction, { passive: true });
    window.addEventListener('keydown', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });

    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = null;
      }
      window.removeEventListener('mousemove', handleUserInteraction);
      window.removeEventListener('mousedown', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [pomoIsRunning]);

  return (
    <main 
      className="fixed inset-0 z-30 flex flex-col justify-between p-4 sm:p-8 animate-fadeIn select-none overflow-hidden"
      onMouseMove={() => {
        if (pomoIsRunning && !controlsVisible) {
          setControlsVisible(true);
        }
      }}
    >
      {/* Top Floating Minimal Bar - Smoothly fades out during active focus */}
      <div 
        className={`w-full max-w-5xl mx-auto flex items-center justify-between z-40 transition-all duration-700 ease-in-out ${
          pomoIsRunning && !controlsVisible 
            ? 'opacity-0 pointer-events-none -translate-y-4' 
            : 'opacity-100 translate-y-0'
        }`}
      >
        {/* Back / Exit Focus Button */}
        <button
          onClick={() => setCurrentTab('dashboard')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-stone-900/60 hover:bg-stone-900/90 text-stone-300 hover:text-white border border-white/10 text-xs font-semibold backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-lg group"
          title="Exit Focus Mode (Esc)"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Exit Focus Mode</span>
          <span className="hidden sm:inline text-[10px] text-stone-500 font-mono-numbers">(Esc)</span>
        </button>

        {/* Minimal Mode Switcher: Timer vs Clock */}
        <div className="flex items-center p-1 rounded-2xl bg-stone-900/60 border border-white/10 backdrop-blur-md shadow-lg">
          <button
            onClick={() => setFocusView('timer')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              focusView === 'timer'
                ? 'bg-amber-400 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Focus Timer</span>
          </button>

          <button
            onClick={() => setFocusView('clock')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              focusView === 'clock'
                ? 'bg-white text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Zen Clock</span>
          </button>
        </div>

        {/* Minimal Sound Controls */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
            className="p-2 rounded-2xl bg-stone-900/60 hover:bg-stone-900/90 text-stone-300 hover:text-white border border-white/10 backdrop-blur-md transition-all"
            title="Volume Control"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <button
            onClick={toggleMute}
            className={`p-2 rounded-2xl border backdrop-blur-md transition-all ${
              isMuted
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                : 'bg-stone-900/60 text-stone-300 hover:text-white border border-white/10'
            }`}
            title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Quick Volume Slider Popover */}
          {showVolumeSlider && (
            <div className="absolute right-0 top-12 w-48 p-3 rounded-2xl bg-stone-950/90 border border-white/15 backdrop-blur-lg shadow-2xl animate-fadeIn z-50">
              <div className="flex justify-between items-center text-[11px] font-bold text-stone-300 mb-2">
                <span>Sound Level</span>
                <span className="text-amber-400 font-mono-numbers">{Math.round(masterVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : masterVolume}
                onChange={(e) => handleMasterVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Center Stage: Pure, Non-distracting Timer or Clock */}
      <div className="flex-1 flex items-center justify-center w-full my-auto z-30">
        <div className="w-full max-w-md animate-fadeIn flex justify-center">
          {focusView === 'timer' ? (
            <PomodoroTimer isImmersive={true} controlsVisible={controlsVisible} />
          ) : (
            <div className="scale-110 sm:scale-125 transition-transform">
              <StudyClock />
            </div>
          )}
        </div>
      </div>

      {/* Minimal Bottom Environment Tagline - Smoothly fades during active focus */}
      <div 
        className={`w-full text-center text-xs text-stone-400/80 font-medium z-30 pointer-events-none transition-all duration-700 ease-in-out ${
          pomoIsRunning && !controlsVisible 
            ? 'opacity-0 translate-y-4' 
            : 'opacity-100 translate-y-0'
        }`}
      >
        <span className="px-3 py-1 rounded-full bg-stone-950/30 backdrop-blur-sm border border-white/5">
          {currentEnvironment.name} • {currentEnvironment.tagline}
        </span>
      </div>
    </main>
  );
}
