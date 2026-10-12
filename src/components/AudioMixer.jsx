import React from 'react';
import { useStudy } from '../context/StudyContext';
import { 
  Volume2, 
  VolumeX, 
  Volume1, 
  X, 
  Sparkles, 
  CloudRain, 
  Coffee, 
  Music, 
  Waves, 
  Feather, 
  Droplets, 
  Flame, 
  Radio 
} from 'lucide-react';

const ICON_MAP = {
  CloudRain,
  Coffee,
  Music,
  Waves,
  Feather,
  Droplets,
  Flame,
  Radio
};

export function AudioMixer({ isOpen, onClose }) {
  const {
    soundTracks,
    activeSounds,
    masterVolume,
    isMuted,
    trackVolumes,
    toggleSound,
    handleMasterVolumeChange,
    handleTrackVolumeChange,
    toggleMute,
    currentEnvironment,
    hciDemoState
  } = useStudy();

  if (!isOpen) return null;

  const suggestedList = currentEnvironment.suggestedSounds || [];
  const isHighlighted = hciDemoState.highlightElementId === 'audio-mixer';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        id="audio-mixer-modal"
        className={`w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel border border-white/15 p-6 shadow-2xl relative ${
          isHighlighted ? 'hci-highlight ring-4 ring-amber-400' : ''
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Ambient Sound Studio</h3>
              <p className="text-xs text-stone-400">
                Layer natural soundscapes and lo-fi chords without distraction
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close Audio Mixer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Volume Bar (Norman's Mapping Principle Demonstration Component) */}
        <div 
          id="master-volume-control"
          className="my-5 p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-200 flex items-center gap-2">
              <span>Master Sound Output</span>
              {activeSounds.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-semibold">
                  {activeSounds.length} Active
                </span>
              )}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-numbers text-amber-300">
                {isMuted ? 'Muted' : `${Math.round(masterVolume * 100)}%`}
              </span>
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
                title={isMuted ? 'Unmute All' : 'Mute All'}
                aria-label="Toggle mute"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume1 className="w-4 h-4 text-amber-300" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <VolumeX className="w-4 h-4 text-stone-500" />
            <input
              id="master-volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={isMuted ? 0 : masterVolume}
              onChange={(e) => handleMasterVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-stone-800 rounded-lg"
              aria-label="Master volume level"
            />
            <Volume2 className="w-4 h-4 text-amber-400" />
          </div>
        </div>

        {/* Channel Grid */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-stone-400 px-1">
            <span>Soundscape Channels</span>
            <span>Recommended for {currentEnvironment.name}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {soundTracks.map((track) => {
              const Icon = ICON_MAP[track.iconName] || Volume2;
              const isActive = activeSounds.includes(track.id);
              const isSuggested = suggestedList.includes(track.id);
              const currentVol = trackVolumes[track.id] ?? track.defaultVolume;

              return (
                <div
                  key={track.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-amber-500/15 border-amber-500/40 shadow-lg shadow-amber-500/10'
                      : 'bg-white/5 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => toggleSound(track.id)}
                      className="flex items-center gap-2.5 text-left group flex-1"
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-amber-400 text-stone-950 font-bold scale-105'
                          : 'bg-white/10 text-stone-300 group-hover:bg-white/20'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold leading-tight ${isActive ? 'text-amber-200' : 'text-stone-200'}`}>
                          {track.name}
                        </span>
                        <span className="text-[10px] text-stone-400">{track.category}</span>
                      </div>
                    </button>

                    {isSuggested && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-white/10 text-stone-300" title="Suggested match">
                        <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                        <span>Match</span>
                      </span>
                    )}
                  </div>

                  {/* Volume Slider for active track */}
                  {isActive && (
                    <div className="flex items-center gap-2 pt-2 border-t border-white/10 animate-fadeIn">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={currentVol}
                        onChange={(e) => handleTrackVolumeChange(track.id, parseFloat(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
                        aria-label={`${track.name} volume`}
                      />
                      <span className="text-[10px] font-mono-numbers text-stone-300 w-7 text-right">
                        {Math.round(currentVol * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
          <span>Procedural Web Audio Engine (100% Offline & Private)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
