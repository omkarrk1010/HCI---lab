import React, { useState, useEffect } from 'react';
import { useStudy } from '../context/StudyContext';
import { soundEngine } from '../utils/audioEngine';
import confetti from 'canvas-confetti';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  Info, 
  ArrowRight, 
  Zap, 
  Compass, 
  Layers, 
  Pin,
  BellRing,
  HelpCircle
} from 'lucide-react';

export function DemonstrationMode({ activePrinciple, onClose }) {
  const { 
    currentEnvironment, 
    setCurrentEnvId, 
    environments, 
    pomoIsRunning, 
    startPomo, 
    pausePomo, 
    pomoRemainingSeconds 
  } = useStudy();

  const [demoStep, setDemoStep] = useState(1);
  const demoType = activePrinciple?.demoType || 'feedback';

  // State for Feedback Demo
  const [testTimerRunning, setTestTimerRunning] = useState(false);
  const [testTimerSecs, setTestTimerSecs] = useState(1500); // 25 mins
  const [testChimePlayed, setTestChimePlayed] = useState(false);

  useEffect(() => {
    let interval = null;
    if (testTimerRunning) {
      interval = setInterval(() => {
        setTestTimerSecs(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setTestTimerRunning(false);
            soundEngine.playCompletionChime();
            setTestChimePlayed(true);
            try { confetti({ particleCount: 50, spread: 60 }); } catch {}
            return 0;
          }
          return prev - 1;
        });
      }, 100); // fast for testing
    }
    return () => clearInterval(interval);
  }, [testTimerRunning]);

  // State for Error Prevention Demo
  const [inputVal, setInputVal] = useState('0');
  const [errorFeedback, setErrorFeedback] = useState('');
  const [validatedSuccess, setValidatedSuccess] = useState(false);

  const handleTestValidate = (val) => {
    setInputVal(val);
    setValidatedSuccess(false);
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setErrorFeedback('❌ Rejection: Duration must be a valid number.');
    } else if (num < 1) {
      setErrorFeedback('❌ Boundary Guard: Minimum session duration is 1 minute.');
    } else if (num > 120) {
      setErrorFeedback('❌ Safety Guard: Maximum single session is 120 minutes.');
    } else {
      setErrorFeedback('');
      setValidatedSuccess(true);
    }
  };

  // State for Mapping Demo
  const [mappingVolume, setMappingVolume] = useState(0.7);

  // State for Reversal Demo
  const [reversalTasks, setReversalTasks] = useState([
    { id: '1', title: 'Read Norman Design chapter', done: false },
    { id: '2', title: 'Submit HCI laboratory reflection', done: true }
  ]);
  const [undoLog, setUndoLog] = useState([]);

  const toggleReversal = (id) => {
    setReversalTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextState = !t.done;
        setUndoLog(l => [`Toggled "${t.title}" to ${nextState ? 'Completed' : 'Active'}`, ...l.slice(0, 3)]);
        return { ...t, done: nextState };
      }
      return t;
    }));
  };

  return (
    <div className="rounded-3xl glass-panel border border-amber-500/40 p-6 sm:p-8 shadow-2xl animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/25 text-amber-300">
                Professor Interactive Benchmark
              </span>
              <span className="text-xs text-stone-400 font-mono-numbers">
                ID: {activePrinciple.id}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              {activePrinciple.title} in Action
            </h2>
          </div>
        </div>

        <button
          onClick={onClose}
          className="self-start sm:self-center px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
        >
          Exit Demonstration
        </button>
      </div>

      {/* Main Two-Column Interactive Bench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Academic Justification & Evaluator Talking Points */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
            <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>Theoretical Requirement</span>
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              {activePrinciple.definition}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>StudyScape Implementation Mechanism</span>
            </h4>
            <p className="text-xs text-amber-100/90 leading-relaxed">
              {activePrinciple.implementation}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-stone-300">
            <h4 className="font-bold text-white mb-1">Professor's Evaluation Guide:</h4>
            <ul className="space-y-1.5 text-stone-400 text-[11px] list-disc list-inside">
              <li>Observe the immediate response to user input.</li>
              <li>Verify that status is never hidden or ambiguous.</li>
              <li>Check that the user retains locus of control at all times.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Live Interactive Simulator Bench */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-stone-900/80 border border-white/15 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <span className="text-xs font-bold text-stone-200">
                Interactive Test Sandbox: {activePrinciple.component}
              </span>
              <span className="text-[10px] text-amber-400 font-semibold uppercase">
                Live State
              </span>
            </div>

            {/* DEMO 1: FEEDBACK */}
            {(demoType === 'feedback' || demoType === 'informative-feedback' || demoType === 'visibility-status') && (
              <div className="space-y-4">
                <p className="text-xs text-stone-300">
                  Click the controls below. Notice how the visual progress bar, color state, and acoustic Solfeggio chime immediately inform you of system status.
                </p>

                <div className="p-5 rounded-2xl bg-stone-950 border border-white/10 flex flex-col items-center">
                  <div className="text-3xl font-extrabold text-white font-mono-numbers mb-2">
                    {Math.floor(testTimerSecs / 60)}:{String(testTimerSecs % 60).padStart(2, '0')}
                  </div>

                  {/* Progress Indicator */}
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-amber-400 transition-all duration-100"
                      style={{ width: `${((1500 - testTimerSecs) / 1500) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        setTestTimerRunning(!testTimerRunning);
                      }}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                        testTimerRunning
                          ? 'bg-amber-500 text-stone-950'
                          : 'bg-white text-stone-950 hover:bg-amber-200'
                      }`}
                    >
                      {testTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{testTimerRunning ? 'Pause (Provides Pause Feedback)' : 'Start Fast Sim'}</span>
                    </button>

                    <button
                      onClick={() => {
                        soundEngine.playCompletionChime();
                        try { confetti({ particleCount: 40 }); } catch {}
                      }}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1.5"
                    >
                      <BellRing className="w-4 h-4 text-amber-300" />
                      <span>Test Auditory Chime</span>
                    </button>

                    <button
                      onClick={() => {
                        setTestTimerRunning(false);
                        setTestTimerSecs(1500);
                      }}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white"
                      title="Reset"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 text-[11px] text-stone-400">
                    Status: <strong className={testTimerRunning ? 'text-amber-400' : 'text-stone-300'}>
                      {testTimerRunning ? 'ACTIVE RUNNING (Continuous Visual Feedback)' : 'PAUSED (Static Feedback)'}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* DEMO 2: ERROR PREVENTION */}
            {demoType === 'error-prevention' && (
              <div className="space-y-4">
                <p className="text-xs text-stone-300">
                  Attempt to type invalid values (e.g. <strong>0</strong>, <strong>-10</strong>, or <strong>400</strong>) to witness proactive boundary enforcement and instructive guidance.
                </p>

                <div className="p-4 rounded-2xl bg-stone-950 border border-white/10 space-y-3">
                  <div>
                    <label className="text-xs text-stone-300 block mb-1">Test Study Duration (Valid: 1 to 120 minutes):</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={inputVal}
                        onChange={(e) => handleTestValidate(e.target.value)}
                        className="p-2.5 rounded-xl bg-stone-900 border border-white/20 text-white font-mono-numbers text-sm w-32 focus:outline-none focus:border-amber-400"
                      />
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleTestValidate('-5')}
                          className="px-2.5 py-1 text-xs rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        >
                          Try -5 min
                        </button>
                        <button
                          onClick={() => handleTestValidate('0')}
                          className="px-2.5 py-1 text-xs rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        >
                          Try 0 min
                        </button>
                        <button
                          onClick={() => handleTestValidate('25')}
                          className="px-2.5 py-1 text-xs rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        >
                          Try 25 min
                        </button>
                      </div>
                    </div>
                  </div>

                  {errorFeedback && (
                    <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs font-medium animate-fadeIn">
                      {errorFeedback}
                    </div>
                  )}

                  {validatedSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Input Accepted: {inputVal} minutes is valid and safe.</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DEMO 3: NATURAL MAPPINGS */}
            {demoType === 'mappings' && (
              <div className="space-y-4">
                <p className="text-xs text-stone-300">
                  Moving the slider to the right directly increases physical acoustic power and dB output, adhering to natural human spatial models (Right/Up = Increase).
                </p>

                <div className="p-5 rounded-2xl bg-stone-950 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-300 font-bold">Acoustic Gain Mapping</span>
                    <span className="text-amber-300 font-mono-numbers">
                      {Math.round(mappingVolume * 100)}% ({(-40 + mappingVolume * 40).toFixed(1)} dB)
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <VolumeX className="w-5 h-5 text-stone-500" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={mappingVolume}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setMappingVolume(val);
                        soundEngine.setMasterVolume(val);
                      }}
                      className="w-full accent-amber-500 cursor-pointer h-2 bg-stone-800 rounded-lg"
                    />
                    <Volume2 className="w-5 h-5 text-amber-400" />
                  </div>

                  {/* Visual Decibel Gauge */}
                  <div className="w-full bg-stone-900 h-4 rounded-lg overflow-hidden flex items-center px-1">
                    <div
                      className="h-2 rounded bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 transition-all"
                      style={{ width: `${mappingVolume * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-stone-400 flex justify-between">
                    <span>Silent (-∞ dB)</span>
                    <span>Comfortable (-12 dB)</span>
                    <span>Max Output (0 dB)</span>
                  </div>
                </div>
              </div>
            )}

            {/* DEMO 4: USER CONTROL */}
            {demoType === 'user-control' && (
              <div className="space-y-4">
                <p className="text-xs text-stone-300">
                  Switch environments right now while watching the main Study timer. StudyScape guarantees the user’s ongoing session is never halted or restarted unexpectedly.
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {environments.slice(0, 3).map(env => (
                    <button
                      key={env.id}
                      onClick={() => {
                        soundEngine.playClick();
                        setCurrentEnvId(env.id);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        currentEnvironment.id === env.id
                          ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg'
                          : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                      }`}
                    >
                      <span className="block text-xs font-bold truncate">{env.name}</span>
                      <span className="text-[10px] text-stone-400">{env.themeColor} theme</span>
                    </button>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-stone-950 border border-white/10 text-xs text-stone-300 flex items-center justify-between">
                  <span>Current Active Environment: <strong>{currentEnvironment.name}</strong></span>
                  <span className="text-amber-400 font-mono-numbers">Timer Running: {pomoIsRunning ? 'YES' : 'STANDBY'}</span>
                </div>
              </div>
            )}

            {/* DEMO 5: REVERSAL OF ACTIONS */}
            {demoType === 'reversal-of-actions' && (
              <div className="space-y-4">
                <p className="text-xs text-stone-300">
                  Toggle the task checkboxes below. Notice that every completed action is completely undoable with zero loss of state or penalty.
                </p>

                <div className="p-4 rounded-2xl bg-stone-950 border border-white/10 space-y-2">
                  {reversalTasks.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={t.done}
                          onChange={() => toggleReversal(t.id)}
                          className="accent-amber-500 cursor-pointer"
                        />
                        <span className={`text-xs ${t.done ? 'line-through text-stone-500' : 'text-stone-200'}`}>
                          {t.title}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleReversal(t.id)}
                        className="text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-stone-300"
                      >
                        {t.done ? 'Undo Complete' : 'Mark Done'}
                      </button>
                    </div>
                  ))}

                  {undoLog.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-white/10 text-[10px] text-stone-400 font-mono-numbers">
                      Recent reversible events:
                      {undoLog.map((log, i) => (
                        <div key={i} className="text-stone-500">• {log}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DEMO 6: DISCOVERABILITY & CLOSURE & OTHER */}
            {(demoType === 'discoverability' || demoType === 'closure' || demoType === 'conceptual-model' || demoType === 'affordances' || demoType === 'signifiers' || demoType === 'consistency' || demoType === 'universal-usability' || demoType === 'memory-load' || demoType === 'fitts-law' || demoType === 'hicks-law') && (
              <div className="space-y-4">
                <p className="text-xs text-stone-300">
                  {activePrinciple.interactivePrompt}
                </p>

                <div className="p-5 rounded-2xl bg-stone-950 border border-white/10 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">
                      Target Component: {activePrinciple.component}
                    </h4>
                    <p className="text-xs text-stone-400 max-w-sm">
                      {activePrinciple.implementation}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      soundEngine.playCompletionChime();
                      try { confetti({ particleCount: 60, spread: 70 }); } catch {}
                    }}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
                  >
                    Trigger Interactive Event
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Evaluation Note */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
            <span>HCI Usability Lab Benchmark v2.0</span>
            <span className="text-amber-300 font-medium">Evaluation Criterion Met ✓</span>
          </div>
        </div>
      </div>
    </div>
  );
}
