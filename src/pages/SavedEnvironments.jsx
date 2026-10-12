import React from 'react';
import { useStudy } from '../context/StudyContext';
import { 
  Compass, 
  Star, 
  Check, 
  Sparkles, 
  Sliders, 
  Eye, 
  Volume2, 
  Layers 
} from 'lucide-react';

export function SavedEnvironments({ onOpenAudioMixer }) {
  const { 
    environments, 
    currentEnvId, 
    setCurrentEnvId, 
    favorites, 
    toggleFavorite,
    overlayOpacity,
    setOverlayOpacity,
    visualEffectsEnabled,
    setVisualEffectsEnabled
  } = useStudy();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Atmospheric Sanctuary Gallery
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Virtual Study Environments
          </h1>
          <p className="text-xs text-stone-300">
            Carefully curated visual spaces and acoustics designed to induce focus and flow.
          </p>
        </div>

        {/* Global Atmosphere Controls */}
        <div className="flex items-center gap-3 p-2 rounded-2xl glass-card border border-white/10">
          <button
            onClick={() => setVisualEffectsEnabled(!visualEffectsEnabled)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              visualEffectsEnabled
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{visualEffectsEnabled ? 'Effects Active' : 'Effects Off'}</span>
          </button>
        </div>
      </div>

      {/* Grid of 6 Environments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {environments.map((env) => {
          const isSelected = env.id === currentEnvId;
          const isFav = favorites.includes(env.id);

          return (
            <div
              key={env.id}
              className={`group rounded-3xl overflow-hidden glass-card border transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-2xl shadow-amber-500/10'
                  : 'border-white/10 hover:border-white/20 hover:shadow-xl'
              }`}
            >
              <div>
                {/* Image Cover */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={env.imageUrl}
                    alt={env.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                  {/* Favorite & Selected Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                      isSelected
                        ? 'bg-amber-500/90 text-stone-950 border-amber-400 font-extrabold'
                        : 'bg-stone-900/80 text-white border-white/10'
                    }`}>
                      {isSelected ? 'Active Space' : env.themeColor}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(env.id);
                      }}
                      className="p-2 rounded-full bg-stone-900/80 backdrop-blur-md text-stone-300 hover:text-amber-400 border border-white/10 transition-colors"
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>

                  {/* Name on image */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-extrabold text-white leading-tight">
                      {env.name}
                    </h3>
                    <p className="text-xs text-amber-200/90 font-medium">
                      {env.tagline}
                    </p>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-5 space-y-4">
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {env.description}
                  </p>

                  {/* Suggested Audio Tags */}
                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-400 block mb-1.5">
                      Suggested Soundscape:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {env.suggestedSounds.map((snd) => (
                        <span
                          key={snd}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-white/10 text-stone-300 capitalize"
                        >
                          {snd}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => setCurrentEnvId(env.id)}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-amber-400 text-stone-950 shadow-lg shadow-amber-400/20'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Current Active Atmosphere</span>
                    </>
                  ) : (
                    <span>Immerse in {env.name}</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
