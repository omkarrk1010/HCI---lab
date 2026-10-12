import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { 
  Target, 
  Volume2, 
  Sliders, 
  CheckCircle2, 
  BookOpen, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export function FocusSessions({ onOpenAudioMixer }) {
  const { 
    currentEnvironment, 
    activeTask, 
    toggleTaskCompletion,
    overlayOpacity,
    setOverlayOpacity
  } = useStudy();

  const [sessionNotes, setSessionNotes] = useState('');

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn pb-16">
      {/* Immersive Focus Banner */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Deep Immersion Mode</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Dedicated Focus Session
        </h1>
        <p className="text-xs text-stone-300">
          Zero noise, dedicated task focus, and natural acoustic ambiance in {currentEnvironment.name}.
        </p>
      </div>

      {/* Large Center Pomodoro Timer */}
      <div className="flex justify-center">
        <div className="w-full max-w-lg">
          <PomodoroTimer size="large" />
        </div>
      </div>

      {/* Target Task Focus Card */}
      {activeTask && (
        <div className="p-5 rounded-3xl glass-card border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleTaskCompletion(activeTask.id)}
              className="p-1 text-stone-400 hover:text-emerald-400 transition-colors"
            >
              {activeTask.completed ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-stone-400" />
              )}
            </button>
            <div>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                Primary Goal
              </span>
              <h3 className={`text-sm font-bold ${activeTask.completed ? 'line-through text-stone-500' : 'text-white'}`}>
                {activeTask.title}
              </h3>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/10 text-stone-200">
            {activeTask.subject}
          </span>
        </div>
      )}

      {/* Quick Session Notepad */}
      <div className="p-5 rounded-3xl glass-card border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs text-stone-300 font-bold">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Session Scratchpad & Key Insights</span>
          </span>
          <span className="text-[10px] text-stone-500">Auto-saved locally</span>
        </div>
        <textarea
          rows={3}
          value={sessionNotes}
          onChange={(e) => setSessionNotes(e.target.value)}
          placeholder="Jot down quick thoughts, formulas, or questions here without opening distracting tabs..."
          className="w-full p-3 rounded-2xl bg-stone-950/60 border border-white/10 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400 resize-none"
        />
      </div>

      {/* Atmosphere Dimmer Control in Focus View */}
      <div className="p-4 rounded-3xl glass-card border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-stone-300">
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>Screen Atmosphere Darkness:</span>
          <span className="text-amber-300 font-mono-numbers">{Math.round(overlayOpacity * 100)}%</span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-64">
          <span className="text-[10px] text-stone-400">Bright</span>
          <input
            type="range"
            min="0.1"
            max="0.85"
            step="0.05"
            value={overlayOpacity}
            onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
          />
          <span className="text-[10px] text-stone-400">Dark</span>
        </div>
      </div>
    </main>
  );
}
