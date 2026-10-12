export const ENVIRONMENTS = [
  {
    id: 'cozy-cafe',
    name: 'Cozy Café',
    tagline: 'Warm wooden tables, steaming mugs, and 2-minute fall cafe jazz',
    description: 'A cozy corner café with warm tungsten lamps, polished oak desks, and 2-Minute Fall Cafe ambience with relaxing jazz music. Ideal for active focus and creative writing.',
    // Curated high-res Unsplash photo with optimized query parameters
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=2000&q=80',
    fallbackGradient: 'linear-gradient(135deg, #2b1d16 0%, #4a3325 50%, #1a120c 100%)',
    accentColor: '#d97706', // Amber-600
    accentLight: '#fef3c7', // Amber-100
    themeColor: 'amber',
    suggestedSounds: ['cafe', 'lofi', 'rain'],
    defaultDurationMinutes: 2,
    overlayDefault: 0.45,
    effect: 'steam', // subtle steam effect
    palette: {
      primary: '#d97706',
      bgDark: '#1c1511',
      badge: 'bg-amber-500/20 text-amber-200 border-amber-500/30',
    }
  },
  {
    id: 'rainy-window',
    name: 'Rainy Window',
    tagline: 'Soft gray skies, 2-minute rain timer, and peaceful solace',
    description: 'A quiet study desk framed by broad glass panels streaked with 2-minute rain timer sounds. The rhythmic patter provides instant calm and deep concentration.',
    imageUrl: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=2000&q=80',
    fallbackGradient: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #0f172a 100%)',
    accentColor: '#38bdf8', // Sky-400
    accentLight: '#e0f2fe',
    themeColor: 'sky',
    suggestedSounds: ['rain', 'lofi', 'whitenoise'],
    defaultDurationMinutes: 2,
    overlayDefault: 0.5,
    effect: 'rain', // falling raindrops animation
    palette: {
      primary: '#38bdf8',
      bgDark: '#0b1329',
      badge: 'bg-sky-500/20 text-sky-200 border-sky-500/30',
    }
  },
  {
    id: 'japanese-study',
    name: 'Japanese Study Room',
    tagline: 'Minimalist tatami, bonsai garden, and Bloody Stream lo-fi',
    description: 'An open traditional Japanese room with light cedarwood, paper shoji screens, and Bloody Stream (Lo-Fi HipHop mix). Encourages clarity and mindful discipline.',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=2000&q=80',
    fallbackGradient: 'linear-gradient(135deg, #2c3029 0%, #444b3c 50%, #1c2019 100%)',
    accentColor: '#10b981', // Emerald / Sage
    accentLight: '#d1fae5',
    themeColor: 'emerald',
    suggestedSounds: ['stream', 'lofi', 'rain'],
    defaultDurationMinutes: 2,
    overlayDefault: 0.4,
    effect: 'leaves',
    palette: {
      primary: '#10b981',
      bgDark: '#121814',
      badge: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30',
    }
  },
  {
    id: 'forest-retreat',
    name: 'Forest Retreat',
    tagline: 'Canopy pine needles, gentle breeze, and wild songbirds',
    description: 'A secluded wooden cabin veranda surrounded by tall emerald fir trees and distant rushing water. Fresh air and zero digital distractions.',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2000&q=80',
    fallbackGradient: 'linear-gradient(135deg, #14231b 0%, #1e3a2b 50%, #0d1712 100%)',
    accentColor: '#84cc16', // Lime / Olive
    accentLight: '#ecfccb',
    themeColor: 'lime',
    suggestedSounds: ['birds', 'stream', 'rain'],
    overlayDefault: 0.45,
    effect: 'fireflies',
    palette: {
      primary: '#84cc16',
      bgDark: '#0e1913',
      badge: 'bg-lime-500/20 text-lime-200 border-lime-500/30',
    }
  },
  {
    id: 'night-library',
    name: 'Night Library',
    tagline: 'Towering leather-bound volumes, green banker lamps, and silence',
    description: 'A stately university library floor late at night. Massive mahogany shelving, warm reading lamps, and an atmosphere steeped in academic discovery.',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=2000&q=80',
    fallbackGradient: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #030712 100%)',
    accentColor: '#fbbf24', // Warm Gold / Amber
    accentLight: '#fef3c7',
    themeColor: 'amber',
    suggestedSounds: ['fireplace', 'cafe', 'lofi'],
    overlayDefault: 0.55,
    effect: 'dust',
    palette: {
      primary: '#fbbf24',
      bgDark: '#0b0f19',
      badge: 'bg-amber-400/20 text-amber-200 border-amber-400/30',
    }
  },
  {
    id: 'ocean-calm',
    name: 'Ocean Calm',
    tagline: 'Endless horizon, rhythmic cresting waves, and salty breezes',
    description: 'A panoramic coastal study desk overlooking turquoise surf breaking softly onto sun-warmed sand. Natural rhythms for effortless concentration.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80',
    fallbackGradient: 'linear-gradient(135deg, #0c2b3d 0%, #164e63 50%, #081a24 100%)',
    accentColor: '#06b6d4', // Cyan
    accentLight: '#cffafe',
    themeColor: 'cyan',
    suggestedSounds: ['ocean', 'stream', 'whitenoise'],
    overlayDefault: 0.4,
    effect: 'pulse',
    palette: {
      primary: '#06b6d4',
      bgDark: '#081720',
      badge: 'bg-cyan-500/20 text-cyan-200 border-cyan-500/30',
    }
  }
];

export const DEFAULT_ENVIRONMENT_ID = 'cozy-cafe';
