import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { StudyClock } from '../components/StudyClock';
import { 
  ArrowLeft, 
  Clock, 
  Flame, 
  Volume2, 
  VolumeX, 
  SlidersHorizontal,
  Maximize2,
  Sparkles
} from 'lucide-react';

export function FocusSessions({ onOpenAudioMixer }) {
  const { 
    currentEnvironment, 
    setCurrentTab,
    isMuted,
    toggleMute,
    activeSounds,
    masterVolume,
    handleMasterVolumeChange
  } = useStudy();

  const [focusView, setFocusView] = useState('timer'); // 'timer' | 'clock'
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  return (
    <main className="fixed inset-0 z-30 flex flex-col justify-between p-6 sm:p-8 animate-fadeIn select-none">
      {/* Top Floating Minimal Bar */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between z-40">
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

      {/* Main Center Stage: Pure Timer or Clock */}
      <div className="flex-1 flex items-center justify-center w-full my-auto z-30">
        <div className="w-full max-w-md animate-fadeIn">
          {focusView === 'timer' ? (
            <PomodoroTimer size="large" />
          ) : (
            <div className="scale-110 sm:scale-125 transition-transform">
              <StudyClock />
            </div>
          )}
        </div>
      </div>

      {/* Minimal Bottom Environment Tagline */}
      <div className="w-full text-center text-xs text-stone-400/80 font-medium z-30 pointer-events-none">
        <span className="px-3 py-1 rounded-full bg-stone-950/40 backdrop-blur-sm border border-white/5">
          {currentEnvironment.name} • {currentEnvironment.tagline}
        </span>
      </div>
    </main>
  );
}
