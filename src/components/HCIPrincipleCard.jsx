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
    norman: { label: "Norman's Principle", class: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    shneiderman: { label: "Shneiderman's Rule", class: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
    usability: { label: "Cognitive / Usability Law", class: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' }
  };

  const badge = categoryBadges[principle.category] || categoryBadges.norman;

  return (
    <div className={`p-6 rounded-3xl glass-card border transition-all duration-300 flex flex-col justify-between ${
      isSelected
        ? 'border-amber-400 bg-amber-500/10 shadow-2xl ring-2 ring-amber-400/40'
        : 'border-white/10 hover:border-white/20 hover:bg-white/5'
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
        <h3 className="text-base sm:text-lg font-bold text-white mb-1">
          {principle.title}
        </h3>
        <p className="text-xs text-amber-300 font-medium mb-3">
          {principle.subtitle}
        </p>

        {/* Academic Definition */}
        <div className="p-3 rounded-2xl bg-black/30 border border-white/5 mb-3 text-xs text-stone-300 leading-relaxed">
          <span className="font-semibold text-white block mb-0.5">Formal Definition:</span>
          {principle.definition}
        </div>

        {/* How StudyScape Implements It */}
        <div className="text-xs text-stone-300 space-y-1 mb-4">
          <span className="font-semibold text-white block">StudyScape Implementation:</span>
          <p className="leading-relaxed text-stone-400">{principle.implementation}</p>
        </div>

        {/* Presentation Evaluation Notes */}
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-amber-200/90 mb-4">
          <span className="font-bold text-amber-300 block mb-0.5">Presentation Note:</span>
          {principle.evaluationNote}
        </div>
      </div>

      {/* Interactive Demonstration Launcher */}
      <button
        onClick={() => onLaunchDemo(principle)}
        className="w-full py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98 shadow-md"
      >
        <PlayCircle className="w-4 h-4" />
        <span>Launch Interactive Demonstration</span>
      </button>
    </div>
  );
}
