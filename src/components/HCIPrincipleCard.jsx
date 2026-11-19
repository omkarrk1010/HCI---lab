import React from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  PlayCircle, 
  CheckCircle, 
  HelpCircle,
  ShieldCheck,
  Compass,
  Sliders,
  Layers
} from 'lucide-react';

export function HCIPrincipleCard({ principle, onLaunchDemo, isSelected }) {
  const categoryBadges = {
    norman: { label: "Norman's Principle", class: 'bg-amber-100 text-amber-700 border-amber-300/50' },
    shneiderman: { label: "Shneiderman's Rule", class: 'bg-sky-100 text-sky-700 border-sky-300/50' },
    usability: { label: "Cognitive / Usability Law", class: 'bg-emerald-100 text-emerald-700 border-emerald-300/50' }
  };

  const badge = categoryBadges[principle.category] || categoryBadges.norman;

  return (
    <div className={`p-6 rounded-3xl glass-card border transition-all duration-300 flex flex-col justify-between ${
      isSelected
        ? 'border-amber-400 bg-amber-100/50 shadow-2xl ring-2 ring-amber-400/40'
        : 'border-stone-900/10 hover:border-stone-900/20 hover:bg-stone-900/4'
    }`}>
      <div>
        {/* Category & Component Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badge.class}`}>
            {badge.label}
          </span>
          <span className="text-[11px] text-stone-400 font-mono-numbers truncate">
            {principle.component}
          </span>
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-base sm:text-lg font-bold text-stone-800 mb-1">
          {principle.title}
        </h3>
        <p className="text-xs text-amber-700 font-medium mb-3">
          {principle.subtitle}
        </p>

        {/* Academic Definition */}
        <div className="p-3 rounded-2xl bg-stone-900/4 border border-stone-900/8 mb-3 text-xs text-stone-600 leading-relaxed">
          <span className="font-semibold text-stone-800 block mb-0.5">Formal Definition:</span>
          {principle.definition}
        </div>

        {/* How StudyScape Implements It */}
        <div className="text-xs text-stone-600 space-y-1 mb-4">
          <span className="font-semibold text-stone-800 block">StudyScape Implementation:</span>
          <p className="leading-relaxed text-stone-400">{principle.implementation}</p>
        </div>

        {/* Presentation Evaluation Notes */}
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/50 text-[11px] text-amber-800/90 mb-4">
          <span className="font-bold text-amber-700 block mb-0.5">Presentation Note:</span>
          {principle.evaluationNote}
        </div>
      </div>

      {/* Interactive Demonstration Launcher */}
      <button
        onClick={() => onLaunchDemo(principle)}
        className="w-full py-2.5 px-4 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-700 border border-amber-300/50 font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98 shadow-md"
      >
        <PlayCircle className="w-4 h-4" />
        <span>Launch Interactive Demonstration</span>
      </button>
    </div>
  );
}
