# StudyScape — An Immersive Study Environment & HCI Project

> **"Find your space. Find your focus."**

StudyScape is an academic Human-Computer Interaction (HCI) project and immersive digital study environment web application designed to foster flow state, reduce cognitive fatigue, and empirically demonstrate **Don Norman's Design Principles**, **Ben Shneiderman's Eight Golden Rules**, and core **Cognitive Ergonomics Laws** through real, testable user interface interactions.

---

## 🌟 Key Highlights & Features

### 1. Immersive Atmospheric Virtual Environments
- **6 Handcrafted Environments**:
  - **Cozy Café**: Warm wooden tables, steaming mugs, tungsten lamps, and gentle barista murmur.
  - **Rainy Window**: Rhythmic gray rain, peaceful glass droplets, and overcast sky.
  - **Japanese Study Room**: Minimal tatami space, shoji screens, and zen garden serenity.
  - **Forest Retreat**: Woodland cabin veranda surrounded by pine needles and wild songbirds.
  - **Night Library**: Stately university library, mahogany shelves, and green banker lamps.
  - **Ocean Calm**: Panoramic coastal workspace with gentle rolling surf and salty breezes.
- **Dynamic Atmospheric Visual Effects**: Falling rain streaks, floating cozy steam motes, firefly embers, and ambient pulses with full `prefers-reduced-motion` compliance.
- **Tunable Atmosphere Dimmer**: Seamless overlay opacity slider (10% to 85% darkness) for optimal reading comfort.
- **Resilient Fallback Design**: Pure CSS radial atmospheric gradients ensure an elegant visual experience even if offline.

### 2. Precision Multi-Mode Study Timers
- **Pomodoro Timer Engine**:
  - Default 25-minute focus, 5-minute short break, 15-minute long break after 4 intervals.
  - Timestamp-based elapsed duration calculations prevent browser tab throttling skew.
  - Dual SVG circular progress ring with animated stroke offsets.
  - Timer continues uninterrupted when switching environments or navigating pages.
- **Configurable Countdown Timer**: Custom hours, minutes, and seconds with input boundary validation.
- **Digital Study Clock**: Live local clock with 12h/24h military toggle, optional seconds, and dynamic greeting.
- **Acoustic Solfeggio Chimes**: 528Hz pure sine wave bell harmonic and celebratory confetti upon completion.

### 3. Procedural Web Audio Ambient Mixer
- **100% Offline Procedural Sound Engine**: Powered by Web Audio API synthesizers and noise filters.
  - **Channels**: Gentle Rain, Café Murmur, Lo-Fi Chill Chords, Rolling Waves, Forest Birds, Mountain Creek, Hearth Fireplace, and Deep White Noise.
  - **Multi-Track Mixing**: Combine rain with lo-fi chords and crackling hearth simultaneously.
  - **Direct Mappings**: Master volume slider with real-time gain node response and single-click mute/unmute.
  - Zero external MP3 network dependencies, zero CORS errors, and zero buffering delays.

### 4. Study Tasks & Cognitive Anchoring
- **Task Manager**: Add, edit, delete, and organize tasks by Subject (HCI, CS, Design, Math, Reading, General) and Priority (High, Medium, Low).
- **Active Focus Target Pinning**: Pin a task directly beneath the study timer, reducing short-term memory load.
- **Reversible Checkbox Completion**: Toggle task states back and forth with zero penalty.

### 5. Genuine Analytics Dashboard
- **Real-Time Local Tracking**: Computes today's focus minutes, completed Pomodoros, and finished tasks from actual sessions.
- **Daily Study Goal**: Adjustable target (60m to 240m) with live percentage progress ring.
- **Interactive 7-Day Bar Chart**: Clean SVG weekly focus distribution with day hover tooltips and goal baseline.
- **Comprehensive Session Log**: Filterable by subject and type with timestamps and environment tags.

### 6. Interactive HCI Usability Lab & Demonstration Mode
- **Norman's Six Design Principles**: Discoverability, Feedback, Conceptual Model, Affordances, Signifiers, and Natural Mappings.
- **Shneiderman's Eight Golden Rules**: Consistency, Universal Usability, Informative Feedback, Dialog Closure, Error Prevention, Easy Reversal of Actions, User Control, and Reduced Memory Load.
- **Cognitive & Ergonomic Laws**: Fitts's Law, Hick's Law, and Visibility of System Status.
- **Professor Interactive Benchmark**: Live interactive sandbox where evaluators can test feedback loops, boundary validation rejection, direct acoustic mappings, and cross-state user control.

---

## 📐 HCI Principles Mapping Matrix

| Framework | Principle | UI Implementation | Empirical Evaluation Criterion |
| :--- | :--- | :--- | :--- |
| **Norman** | **Discoverability** | Centered Timer Controls & Environment Strip | Primary actions are immediately visible upon launch with no hidden mystery menus. |
| **Norman** | **Feedback** | SVG Progress Ring, Dynamic Title, Acoustic Solfeggio Chime | Continuous millisecond-smooth visual stroke updates and multi-sensory audio confirmation. |
| **Norman** | **Conceptual Model** | 4-Stage Pomodoro Interval Dots | Matches the established mental model of 4 focus intervals followed by an extended break. |
| **Norman** | **Affordances** | Tactile Sliders & Elevated Environment Cards | Controls visually invite sliding, dragging, and clicking before pointer contact. |
| **Norman** | **Signifiers** | Active Glow Rings, Play/Pause Icons, Equalizer Bars | Explicit labels, pulsating dots, and tooltips indicate precise actionable states. |
| **Norman** | **Natural Mappings** | Master Volume & Dimmer Slider | Horizontal slider travel directly corresponds to acoustic amplitude and screen brightness. |
| **Shneiderman** | **1. Consistency** | Unified Glass Surfaces & Standard Typography | Uniform visual hierarchy (Plus Jakarta Sans for UI, JetBrains Mono for metrics) across all views. |
| **Shneiderman** | **2. Universal Usability**| Responsive Layout & Keyboard Shortcuts | Spacebar toggles timer, 'M' mutes audio, 'Esc' closes modals; WCAG AA contrast compliance. |
| **Shneiderman** | **3. Informative Feedback**| Modulated Action Feedback | Subtle micro-animations for minor clicks; fanfare confetti and Solfeggio chimes for completions. |
| **Shneiderman** | **4. Dialog Closure** | Session Completion Modal | Provides clear psychological relief and structured transition prompt into scheduled breaks. |
| **Shneiderman** | **5. Prevent Errors** | Input Range Guards & Reset Confirmation | Rejects durations <= 0 or > 120; prompts user before resetting active running study blocks. |
| **Shneiderman** | **6. Easy Reversal** | Reversible Task Checkbox & Pause/Resume | Users can uncheck completed tasks or resume paused timers without losing elapsed time. |
| **Shneiderman** | **7. Keep Users in Control**| State-Preserving Environment Switcher | Timer never halts or resets when users switch ambient spaces, themes, or audio tracks. |
| **Shneiderman** | **8. Reduce Memory Load** | Pinned Focus Target Task Header | Offloads active study goal tracking from biological short-term memory onto persistent UI. |
| **Cognitive** | **Fitts's Law** | Oversized 72px Center Play/Pause Button | Maximizes target width ($W$) and centers target distance ($D$) to minimize acquisition time. |
| **Cognitive** | **Hick's Law** | 6 Curated Archetypes & 3 Clear Modes | Replaces cognitive decision paralysis with a streamlined, high-signal choice set. |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or newer recommended)
- npm or pnpm

### Installation & Launch

1. **Clone or open the workspace**:
   ```bash
   cd HCI-project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser to [http://localhost:5173](http://localhost:5173).

4. **Build production bundle**:
   ```bash
   npm run build
   ```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Usability Benefit |
| :--- | :--- | :--- |
| `Space` | Start / Pause Active Timer | Rapid single-key control (Fitts's Law) |
| `M` / `m` | Mute / Unmute All Sounds | Instant acoustic management |
| `Esc` | Close Audio Mixer / Modals | Rapid dialogue exit (Reversal of actions) |

---

## 🧪 Tests Performed

1. **Build & Bundler Verification**: Executed `npm run build` using Vite v8.3.4; bundle created cleanly in under 200ms with zero lint or syntax errors.
2. **Timer State Persistence**: Validated that starting a 25-minute Pomodoro in *Cozy Café*, switching to *Rainy Window*, and navigating between *Focus Sessions*, *HCI Lab*, and *Analytics* preserves the running countdown down to the exact second.
3. **Web Audio Synthesizer**: Tested procedural sound channels (Rain, Café, Waves, Fireplace, Chords) and confirmed smooth multi-channel mixing, real-time volume mapping, and Solfeggio completion chime.
4. **Error Prevention Testing**: Tested duration input guards by inputting negative numbers (`-5`), zero (`0`), and out-of-range values (`500`). The interface successfully blocked invalid inputs with descriptive error alerts.
5. **Session Logging & Analytics**: Verified that completed focus sessions trigger confetti, increment the daily focus tally, render on the 7-day SVG chart, and persist in `localStorage`.
