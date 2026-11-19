import React from 'react';
import { useStudy } from '../context/StudyContext';
import { computeStudyPersonality } from '../utils/analyticsUtils';
import { Fingerprint, Moon, Sun, Layers, Compass, CheckCircle2, Sparkles } from 'lucide-react';

const TRAITS = [
  { key: 'consistency', label: 'Consistency', icon: CheckCircle2, color: 'from-emerald-400 to-emerald-300' },
  { key: 'depth', label: 'Deep Focus', icon: Layers, color: 'from-amber-500 to-amber-300' },
  { key: 'variety', label: 'Variety-Seeking', icon: Compass, color: 'from-sky-400 to-sky-300' },
  { key: 'discipline', label: 'Discipline', icon: Fingerprint, color: 'from-rose-400 to-rose-300' }
];

export function StudyPersonality() {
  const { sessionHistory, tasks } = useStudy();
  const data = computeStudyPersonality(sessionHistory, tasks);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="p-5 rounded-3xl glass-panel-light">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
            AI Study Personality Analysis
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-800">
          Your study fingerprint
        </h1>
        <p className="text-xs text-stone-500 max-w-xl">
          A behavioral profile built from your session timing, duration, and consistency — not a quiz, just your data.
        </p>
      </div>

      {/* Archetype Hero */}
      <section className="p-6 rounded-3xl glass-panel flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-400 to-amber-300 flex items-center justify-center shadow-sm shrink-0">
          <Fingerprint className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Your Archetype</span>
          <h2 className="text-xl font-black text-stone-800">{data.archetype}</h2>
          <p className="text-xs text-stone-500 mt-1 max-w-md">{data.tagline}</p>
        </div>
        {data.ready && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 shrink-0">
            {data.traits.nightOwl >= 55 ? <Moon className="w-4 h-4 text-sky-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>{data.traits.nightOwl >= 55 ? 'Night Owl' : 'Early Bird'}</span>
          </div>
        )}
      </section>

      {!data.ready ? (
        <section className="p-8 rounded-3xl glass-card text-center space-y-2">
          <Sparkles className="w-6 h-6 text-amber-400 mx-auto" />
          <p className="text-sm text-stone-500">{data.tagline}</p>
        </section>
      ) : (
        <>
          {/* Trait Bars */}
          <section className="p-5 rounded-3xl glass-card space-y-4">
            <h3 className="text-sm font-bold text-stone-800">Trait Breakdown</h3>
            <div className="space-y-3">
              {TRAITS.map((trait) => {
                const Icon = trait.icon;
                const value = data.traits[trait.key];
                return (
                  <div key={trait.key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-stone-600 flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-stone-400" />
                        {trait.label}
                      </span>
                      <span className="text-xs font-bold text-stone-700 font-mono-numbers">{value}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-stone-900/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${trait.color} transition-all duration-500`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Night Owl / Early Bird spectrum */}
          <section className="p-5 rounded-3xl glass-card space-y-3">
            <h3 className="text-sm font-bold text-stone-800">Chronotype Spectrum</h3>
            <div className="relative h-3 rounded-full bg-gradient-to-r from-amber-200 via-amber-300 to-sky-400 overflow-visible">
              <div
                className="absolute -top-1.5 w-6 h-6 rounded-full bg-stone-50 border-2 border-stone-800/80 shadow-md flex items-center justify-center"
                style={{ left: `calc(${data.traits.nightOwl}% - 12px)` }}
              >
                {data.traits.nightOwl >= 55 ? <Moon className="w-3 h-3 text-sky-600" /> : <Sun className="w-3 h-3 text-amber-600" />}
              </div>
            </div>
            <div className="flex justify-between text-[11px] text-stone-400 font-semibold pt-2">
              <span>Early Bird</span>
              <span>Night Owl</span>
            </div>
          </section>

          {/* Summary bullets */}
          <section className="p-5 rounded-3xl glass-card space-y-3">
            <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-500" />
              What the Data Shows
            </h3>
            <ul className="space-y-2">
              {data.summary.map((text, i) => (
                <li key={i} className="text-xs text-stone-600 bg-stone-900/4 rounded-xl p-3 leading-relaxed">
                  {text}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </main>
  );
}
