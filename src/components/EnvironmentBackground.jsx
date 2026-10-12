import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';

export function EnvironmentBackground() {
  const { currentEnvironment, overlayOpacity, visualEffectsEnabled, appSettings } = useStudy();
  const [imageFailed, setImageFailed] = useState(false);

  // If environment changes, reset image failure state
  React.useEffect(() => {
    setImageFailed(false);
  }, [currentEnvironment.id]);

  const showEffects = visualEffectsEnabled && !appSettings.reduceMotion;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none select-none overflow-hidden transition-colors duration-1000">
      {/* Fallback Atmospheric Gradient */}
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{ background: currentEnvironment.fallbackGradient }}
      />

      {/* Main Photographic Layer */}
      {!imageFailed && (
        <img
          key={currentEnvironment.id}
          src={currentEnvironment.imageUrl}
          alt={currentEnvironment.name}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 animate-fadeIn"
          style={{ filter: 'saturate(1.08) contrast(1.02)' }}
          onError={() => setImageFailed(true)}
        />
      )}

      {/* Dynamic Ambient Visual Atmosphere Effects */}
      {showEffects && currentEnvironment.effect === 'rain' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="rain-streak"
              style={{
                left: `${(i * 4.2) + (Math.random() * 2)}%`,
                top: `${-20 - Math.random() * 40}px`,
                height: `${40 + Math.random() * 60}px`,
                animationDuration: `${0.8 + Math.random() * 0.7}s`,
                animationDelay: `${Math.random() * 1.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {showEffects && currentEnvironment.effect === 'steam' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="ambient-particle absolute rounded-full bg-amber-200/10 blur-xl"
              style={{
                width: `${80 + i * 20}px`,
                height: `${80 + i * 20}px`,
                left: `${20 + (i * 9)}%`,
                bottom: `${10 + (i * 6)}%`,
                animationDelay: `${i * 0.8}s`
              }}
            />
          ))}
        </div>
      )}

      {showEffects && (currentEnvironment.effect === 'fireflies' || currentEnvironment.effect === 'dust') && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="ambient-particle absolute rounded-full bg-amber-100/25 blur-[1px]"
              style={{
                width: `${4 + (i % 3) * 2}px`,
                height: `${4 + (i % 3) * 2}px`,
                left: `${(i * 7 + 10) % 95}%`,
                top: `${(i * 13 + 15) % 85}%`,
                animationDuration: `${4 + (i % 4) * 2}s`,
                animationDelay: `${i * 0.4}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Tunable Dark Dimming Overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundColor: '#000000',
          opacity: overlayOpacity
        }}
      />

      {/* Vignette Gradient for Depth and Legibility */}
      <div className="absolute inset-0 bg-radial-vignette opacity-50" />
    </div>
  );
}
