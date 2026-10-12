import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { HCI_PRINCIPLES, HCI_CATEGORIES } from '../data/hciPrinciples';
import { HCIPrincipleCard } from '../components/HCIPrincipleCard';
import { DemonstrationMode } from '../components/DemonstrationMode';
import { 
  GraduationCap, 
  Search, 
  Play, 
  Sparkles, 
  BookOpen, 
  Award, 
  Filter,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export function HCILab() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDemoPrinciple, setActiveDemoPrinciple] = useState(null);

  const filteredPrinciples = HCI_PRINCIPLES.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.implementation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.component.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLaunchDemo = (principle) => {
    setActiveDemoPrinciple(principle);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fadeIn pb-20">
      {/* HCI Academic Header */}
      <section className="p-6 sm:p-8 rounded-3xl glass-panel border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Evaluation Center • Human-Computer Interaction (HCI)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            StudyScape HCI Lab & Usability Laboratory
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            This module provides empirical demonstrations of <strong>Don Norman’s Design Principles</strong>, <strong>Ben Shneiderman’s Eight Golden Rules</strong>, and <strong>Cognitive Psychology Ergonomics</strong>. Each principle is grounded in real, testable user interface components.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => handleLaunchDemo(HCI_PRINCIPLES[1])} // Feedback Demo
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-400/20 transition-all hover:scale-102"
            >
              <Play className="w-4 h-4 fill-stone-950" />
              <span>Launch Interactive Professor Benchmark</span>
            </button>
            <span className="text-xs text-stone-400">
              Interactive test bench with step-by-step verification
            </span>
          </div>
        </div>
      </section>

      {/* ACTIVE DEMONSTRATION MODE BENCH */}
      {activeDemoPrinciple && (
        <DemonstrationMode
          activePrinciple={activeDemoPrinciple}
          onClose={() => setActiveDemoPrinciple(null)}
        />
      )}

      {/* Category Tabs & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'bg-white/5 text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            All Principles ({HCI_PRINCIPLES.length})
          </button>

          {HCI_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'bg-white/5 text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search principles or laws..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-900/80 border border-white/15 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Principles Catalog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrinciples.map((principle) => (
          <HCIPrincipleCard
            key={principle.id}
            principle={principle}
            onLaunchDemo={handleLaunchDemo}
            isSelected={activeDemoPrinciple?.id === principle.id}
          />
        ))}
      </div>

      {/* HCI Evaluation Framework Matrix Table */}
      <section className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Academic Evaluation Matrix: Theoretical Alignment</span>
        </h3>
        <p className="text-xs text-stone-300">
          Summary mapping for presentation grading and oral defense:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead>
              <tr className="border-b border-white/10 text-[11px] font-bold uppercase text-stone-400">
                <th className="py-2.5 px-3">Framework</th>
                <th className="py-2.5 px-3">Principle</th>
                <th className="py-2.5 px-3">Interface Component</th>
                <th className="py-2.5 px-3">Empirical Evaluation Criterion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr>
                <td className="py-2 px-3 font-semibold text-amber-300">Norman</td>
                <td className="py-2 px-3">Discoverability</td>
                <td className="py-2 px-3">Primary Action Cluster</td>
                <td className="py-2 px-3 text-stone-400">Immediate visibility of timer play/pause buttons</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-amber-300">Norman</td>
                <td className="py-2 px-3">Feedback</td>
                <td className="py-2 px-3">SVG Progress Ring & Solfeggio Chime</td>
                <td className="py-2 px-3 text-stone-400">Continuous visible progression and acoustic closure confirmation</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-sky-300">Shneiderman</td>
                <td className="py-2 px-3">Prevent Errors</td>
                <td className="py-2 px-3">Duration Validator & Reset Guard</td>
                <td className="py-2 px-3 text-stone-400">Rejects invalid ranges and confirms accidental resets</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-sky-300">Shneiderman</td>
                <td className="py-2 px-3">User Control</td>
                <td className="py-2 px-3">Environment Cross-Switching</td>
                <td className="py-2 px-3 text-stone-400">Timer preservation during background/audio switches</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-emerald-300">Cognitive Law</td>
                <td className="py-2 px-3">Fitts's Law</td>
                <td className="py-2 px-3">72px Centered Start Button</td>
                <td className="py-2 px-3 text-stone-400">Minimized target distance and maximized click surface</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-emerald-300">Cognitive Law</td>
                <td className="py-2 px-3">Hick's Law</td>
                <td className="py-2 px-3">6-Environment Curation Grid</td>
                <td className="py-2 px-3 text-stone-400">Reduces choice complexity from infinite dials to 6 high-signal choices</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
