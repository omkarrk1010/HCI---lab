export const HCI_CATEGORIES = [
  { id: 'norman', label: "Norman's Design Principles" },
  { id: 'shneiderman', label: "Shneiderman's 8 Golden Rules" },
  { id: 'usability', label: "Usability & Cognitive Laws" }
];

export const HCI_PRINCIPLES = [
  // --- A. NORMAN'S SIX DESIGN PRINCIPLES ---
  {
    id: 'discoverability',
    category: 'norman',
    title: 'Discoverability',
    subtitle: "Make possible actions immediately visible and intuitive",
    definition: 'Discoverability refers to whether users can easily figure out what actions are possible and where and how to perform them without prior instruction.',
    implementation: 'StudyScape clusters essential actions into intuitive visual groups: the primary Study timer is centered with prominent play/pause buttons; environment presets feature thumbnail previews; audio toggles are immediately accessible on the bottom tray.',
    component: 'Pomodoro Timer & Environment Bar',
    demoType: 'discoverability',
    interactivePrompt: 'Hover over the control buttons and inspect the visible primary actions.',
    evaluationNote: 'Action alternatives are visible on first glance rather than hidden behind nested dropdowns or mystery-meat icons.'
  },
  {
    id: 'feedback',
    category: 'norman',
    title: 'Feedback',
    subtitle: "Send clear, real-time results for every user interaction",
    definition: 'Feedback is sending information back to the user about what action has been done and what result was accomplished, ensuring they are never left wondering.',
    implementation: 'The circular progress ring updates every second with millisecond-smooth SVG stroke offsets; timer buttons change color and icon state dynamically; timer completion triggers Solfeggio acoustic chimes and confetti animations.',
    component: 'Circular Progress Ring & Audio Chime',
    demoType: 'feedback',
    interactivePrompt: 'Start, pause, or finish a timer session to observe real-time visual, auditory, and numeric feedback.',
    evaluationNote: 'System status is communicated continuously through multi-sensory feedback: SVG progress rings, button state morphing, and gentle auditory completion chimes.'
  },
  {
    id: 'conceptual-model',
    category: 'norman',
    title: 'Conceptual Model',
    subtitle: "Provide an intuitive mental model of how the system functions",
    definition: 'A conceptual model is a high-level explanation of how a system works. A good conceptual model allows users to predict the effects of their actions and understand state changes.',
    implementation: 'The Pomodoro loop clearly illustrates the cycle: [Focus Session (25m)] → [Short Break (5m)] × 4 → [Long Break (15m)]. Visual progress dots indicate the exact stage within the 4-interval cycle so students understand what phase comes next.',
    component: 'Pomodoro Cycle Indicator Dots',
    demoType: 'conceptual-model',
    interactivePrompt: 'Cycle through the Pomodoro stages to see how the mental model guides the workflow.',
    evaluationNote: 'Matches the established real-world Pomodoro technique schema, eliminating ambiguity about break timing.'
  },
  {
    id: 'affordances',
    category: 'norman',
    title: 'Affordances',
    subtitle: "Ensure controls invite their appropriate physical interactions",
    definition: 'An affordance is the relationship between the properties of an object and the capabilities of the agent that determines just how the object could possibly be used.',
    implementation: 'Volume and brightness sliders possess physical handle "thumbs" and linear tracks that afford dragging and sliding; clickable environment cards have depth, rounded corners, and elevated hover states that afford clicking.',
    component: 'Sliders & Environment Cards',
    demoType: 'affordances',
    interactivePrompt: 'Drag the slider track and hover over the environment cards.',
    evaluationNote: 'Interactive elements visually communicate actionable affordances prior to cursor contact.'
  },
  {
    id: 'signifiers',
    category: 'norman',
    title: 'Signifiers',
    subtitle: "Signal where and how an interaction should take place",
    definition: 'Signifiers communicate where an action should take place through explicit symbols, labels, color highlights, icons, and tooltips.',
    implementation: 'Active environments feature a luminous accent border and checkmark; buttons feature recognized Lucide iconography alongside text labels; active sound tracks show pulsing equalizer bars.',
    component: 'Selected State Badges & Play Icons',
    demoType: 'signifiers',
    interactivePrompt: 'Toggle environments and audio channels to see how signifiers signal state.',
    evaluationNote: 'Solves the "Norman door" problem by ensuring icons are always accompanied by textual signifiers and active states.'
  },
  {
    id: 'mappings',
    category: 'norman',
    title: 'Natural Mappings',
    subtitle: "Align spatial control directions directly with their real-world outcomes",
    definition: 'Mapping is the relationship between the controls and their movements or results in the environment. Natural mappings exploit spatial analogies and cultural standards.',
    implementation: 'Moving the slider to the right increases sound volume and screen brightness; clicking "Skip" advances forward in the Pomodoro timeline; moving slider left dims or silences.',
    component: 'Master Volume & Overlay Sliders',
    demoType: 'mappings',
    interactivePrompt: 'Move the volume slider left and right to inspect the exact decibel and percentage mapping.',
    evaluationNote: 'Controls strictly honor universal spatial conventions (left = decrease, right = increase).'
  },

  // --- B. SHNEIDERMAN'S EIGHT GOLDEN RULES ---
  {
    id: 'consistency',
    category: 'shneiderman',
    title: '1. Strive for Consistency',
    subtitle: "Uniform color coding, button styles, typography, and terminology",
    definition: 'Consistent sequences of actions should be required in similar situations; identical terminology should be used in prompts, menus, and help screens; and consistent color, layout, capitalization, and fonts should be employed throughout.',
    implementation: 'All modal panels use identical glass styling, rounded 16px geometry, button hierarchy (solid primary, outline secondary), and unified typography (Plus Jakarta Sans for UI, JetBrains Mono for numbers).',
    component: 'Design System & Typography',
    demoType: 'consistency',
    interactivePrompt: 'Compare the visual grammar across Study Room, Analytics, and Settings.',
    evaluationNote: 'Cognitive friction is minimized because users do not need to relearn button styles across views.'
  },
  {
    id: 'universal-usability',
    category: 'shneiderman',
    title: '2. Seek Universal Usability',
    subtitle: "Support diverse users, viewports, keyboard control, and accessibility",
    definition: 'Recognize the needs of diverse users and design for plasticity, facilitating transformation of content across varied devices, experience levels, and accessibility needs.',
    implementation: 'Fully responsive from mobile (375px) to 4K displays; full keyboard navigation support with Tab indexing and Enter activation; WCAG AA compliant contrast; support for prefers-reduced-motion.',
    component: 'Responsive Layout & Accessibility Focus Rings',
    demoType: 'universal-usability',
    interactivePrompt: 'Use your keyboard Tab key to navigate between controls, or toggle Reduced Motion in Settings.',
    evaluationNote: 'Complies with universal design principles regardless of assistive tech or device constraints.'
  },
  {
    id: 'informative-feedback',
    category: 'shneiderman',
    title: '3. Offer Informative Feedback',
    subtitle: "Provide clear system response for every frequent and infrequent action",
    definition: 'For every user action, there should be system feedback. For frequent and minor actions, the response can be modest, whereas for infrequent and major actions, the response should be more substantial.',
    implementation: 'Minor actions (changing a sound) produce instant audio balance changes and glowing icon badges; major actions (completing a 25-minute Pomodoro) trigger fanfare confetti, sound chime, and analytics logging.',
    component: 'Live Session Feedback & Toasts',
    demoType: 'informative-feedback',
    interactivePrompt: 'Trigger a session completion event to witness the major feedback celebration.',
    evaluationNote: 'Modulates feedback intensity based on the significance of the completed user task.'
  },
  {
    id: 'closure',
    category: 'shneiderman',
    title: '4. Design Dialogs to Yield Closure',
    subtitle: "Organize workflows into clear beginning, middle, and ending stages",
    definition: 'Sequences of actions should be organized into groups with a beginning, middle, and end. Informative feedback at the completion of a group of actions gives operators the satisfaction of accomplishment, a sense of relief, and a signal to prepare for the next group.',
    implementation: 'Focus sessions start with "Start Studying", show remaining time in the middle, and display a celebratory completion dialog when finished, with a clear prompt: "Great work! Ready for a 5-minute break?".',
    component: 'Session Completion Dialog',
    demoType: 'closure',
    interactivePrompt: 'Experience the transition from active focus to completed closure modal.',
    evaluationNote: 'Provides clear psychological closure, signaling that the user can relax before the next interval.'
  },
  {
    id: 'error-prevention',
    category: 'shneiderman',
    title: '5. Prevent Errors',
    subtitle: "Make it impossible to enter invalid states, and provide input guards",
    definition: 'Design the system so users cannot make serious errors. If an error is made, the interface should detect the error and offer simple, constructive, and specific instructions for recovery.',
    implementation: 'Countdown timer fields restrict input between 1 and 180 minutes; negative numbers and decimals are blocked; a confirmation guard protects against accidentally resetting an active 20-minute study session.',
    component: 'Timer Duration Validator & Reset Guard',
    demoType: 'error-prevention',
    interactivePrompt: 'Try entering an invalid duration (e.g. 0 or 500) or resetting an active session to see error guards.',
    evaluationNote: 'Preempts catastrophic user mistakes through boundary validation and confirmation guards.'
  },
  {
    id: 'reversal-of-actions',
    category: 'shneiderman',
    title: '6. Permit Easy Reversal of Actions',
    subtitle: "Relieve anxiety by making actions easily reversible and undoable",
    definition: 'Actions should be reversible. This feature relieves anxiety, since the user knows that errors can be undone, thus encouraging exploration of unfamiliar options.',
    implementation: 'Completed tasks can be unmarked and restored with one click; paused timers can be resumed seamlessly without losing elapsed minutes; environment changes can be reverted instantly.',
    component: 'Task Reversible Checkbox & Pause/Resume',
    demoType: 'reversal-of-actions',
    interactivePrompt: 'Mark a task as complete and uncheck it to restore it to active state.',
    evaluationNote: 'Lowers interaction inhibition by offering risk-free exploration and instant undo capabilities.'
  },
  {
    id: 'user-control',
    category: 'shneiderman',
    title: '7. Keep Users in Control',
    subtitle: "Support internal locus of control so users initiate and govern actions",
    definition: 'Experienced users strongly desire the sense that they are in charge of the interface and that the interface responds to their actions. Avoid surprises or unexpected automations.',
    implementation: 'Automatic break transitions are an opt-in toggle rather than forced; users can pause at any second; users can mix any custom combination of rain, lo-fi, and waves; timer never resets when switching environments.',
    component: 'Audio Mixer & Multi-Environment Switcher',
    demoType: 'user-control',
    interactivePrompt: 'Switch between environments while the timer is actively running without losing a second.',
    evaluationNote: 'The user is always the initiator of action; the system never commandeers focus unprompted.'
  },
  {
    id: 'memory-load',
    category: 'shneiderman',
    title: '8. Reduce Short-Term Memory Load',
    subtitle: "Keep active goals, remaining time, and context visible on-screen",
    definition: 'A user’s short-term memory is limited. Designs should avoid requiring users to remember information across displays, preferring recognition over recall.',
    implementation: 'The currently selected study task is pinned directly below the digital timer; the active environment name and sound channels remain visible in the header; analytics summarize today’s progress without requiring mental math.',
    component: 'Active Task Header & Breadcrumbs',
    demoType: 'memory-load',
    interactivePrompt: 'Assign a focus task and observe how it stays pinned to anchor student attention.',
    evaluationNote: 'Adheres to Miller’s Law (7 ± 2 chunks) by offloading cognitive tracking onto persistent UI anchors.'
  },

  // --- C. ADDITIONAL COGNITIVE & USABILITY PRINCIPLES ---
  {
    id: 'fitts-law',
    category: 'usability',
    title: "Fitts's Law",
    subtitle: "Target size and distance dictate acquisition speed",
    definition: 'The time required to rapidly move to a target area is a function of the ratio between the distance to the target and the width of the target (T = a + b log2(2D/W)).',
    implementation: 'The primary Play/Pause/Start button is substantially oversized (72px diameter) and placed dead-center on the screen for instantaneous cursor targeting with minimal movement time.',
    component: 'Primary Action Timer Button',
    demoType: 'fitts-law',
    interactivePrompt: 'Test click latency on the giant primary button versus secondary controls.',
    evaluationNote: 'Maximizes target area (W) and centers position (D) to guarantee rapid, error-free clicks.'
  },
  {
    id: 'hicks-law',
    category: 'usability',
    title: "Hick's Law",
    subtitle: "Decision time increases with the number and complexity of choices",
    definition: 'The time it takes to make a decision increases logarithmically as the number of choices increases (T = b · log2(n + 1)).',
    implementation: 'StudyScape limits environment presets to exactly 6 carefully curated archetypes, and timer modes to 3 clear tabs (Pomodoro, Countdown, Clock), eliminating analysis paralysis.',
    component: 'Curated 6-Environment Grid',
    demoType: 'hicks-law',
    interactivePrompt: 'Observe the categorized tabs that prevent choice fatigue.',
    evaluationNote: 'Minimizes cognitive overhead by chunking options into a streamlined, high-signal palette.'
  },
  {
    id: 'visibility-status',
    category: 'usability',
    title: 'Visibility of System Status',
    subtitle: "Always keep users informed about what is happening in reasonable time",
    definition: 'The design should always keep users informed about what is going on, through appropriate feedback within a reasonable amount of time.',
    implementation: 'Live pulsing indicators show when audio is playing; browser tab title dynamically reflects the running countdown (e.g. "24:15 | StudyScape"); session progress percentage is computed in real time.',
    component: 'Live Equalizer & Dynamic Title',
    demoType: 'visibility-status',
    interactivePrompt: 'Start the timer and notice how system state is broadcast through multiple channels.',
    evaluationNote: 'Zero ambiguity about whether the timer is running, paused, or finished.'
  }
];
