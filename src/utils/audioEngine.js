/**
 * Web Audio API Procedural Sound Engine
 * Provides authentic, lightweight ambient sounds and chimes with zero external file dependencies or CORS failures.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.channels = {};
    this.isMuted = false;
    this.masterVolume = 0.7;
    this.trackVolumes = {
      rain: 0.5,
      cafe: 0.4,
      ocean: 0.5,
      stream: 0.4,
      birds: 0.35,
      fireplace: 0.45,
      lofi: 0.4,
      whitenoise: 0.3
    };
    this.activeTracks = new Set();
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMasterVolume(val) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    if (this.ctx && this.masterGain && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.05);
    }
  }

  setMute(mute) {
    this.isMuted = mute;
    if (this.ctx && this.masterGain) {
      const target = mute ? 0 : this.masterVolume;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
  }

  setTrackVolume(trackId, val) {
    this.trackVolumes[trackId] = Math.max(0, Math.min(1, val));
    if (this.channels[trackId] && this.channels[trackId].gainNode && this.ctx) {
      this.channels[trackId].gainNode.gain.setTargetAtTime(this.trackVolumes[trackId], this.ctx.currentTime, 0.05);
    }
  }

  playCompletionChime() {
    try {
      this.initContext();
      const now = this.ctx.currentTime;
      
      // Dual harmonic meditative chime (528Hz Solfeggio Love frequency + octave)
      const freqs = [528, 1056, 1584];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const amp = 0.25 / (idx + 1);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(amp, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

        osc.connect(gain);
        gain.connect(this.masterGain || this.ctx.destination);

        osc.start(now);
        osc.stop(now + 2.5);
      });
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }

  playClick() {
    try {
      this.initContext();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.masterGain || this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignored
    }
  }

  startTrack(trackId) {
    this.initContext();
    if (this.activeTracks.has(trackId)) return;

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(this.trackVolumes[trackId] ?? 0.5, this.ctx.currentTime);
    gainNode.connect(this.masterGain);

    let stopFn = () => {};

    switch (trackId) {
      case 'rain':
        stopFn = this._createRainGenerator(gainNode);
        break;
      case 'ocean':
        stopFn = this._createOceanGenerator(gainNode);
        break;
      case 'cafe':
        stopFn = this._createCafeGenerator(gainNode);
        break;
      case 'stream':
        stopFn = this._createStreamGenerator(gainNode);
        break;
      case 'birds':
        stopFn = this._createBirdsGenerator(gainNode);
        break;
      case 'fireplace':
        stopFn = this._createFireGenerator(gainNode);
        break;
      case 'lofi':
        stopFn = this._createLofiGenerator(gainNode);
        break;
      case 'whitenoise':
        stopFn = this._createWhiteNoiseGenerator(gainNode);
        break;
      default:
        stopFn = this._createWhiteNoiseGenerator(gainNode);
    }

    this.channels[trackId] = { gainNode, stopFn };
    this.activeTracks.add(trackId);
  }

  stopTrack(trackId) {
    if (!this.activeTracks.has(trackId)) return;
    const channel = this.channels[trackId];
    if (channel) {
      try {
        channel.stopFn();
        channel.gainNode.disconnect();
      } catch (e) {
        console.warn('Error stopping track:', e);
      }
      delete this.channels[trackId];
    }
    this.activeTracks.delete(trackId);
  }

  toggleTrack(trackId) {
    if (this.activeTracks.has(trackId)) {
      this.stopTrack(trackId);
      return false;
    } else {
      this.startTrack(trackId);
      return true;
    }
  }

  stopAll() {
    const list = Array.from(this.activeTracks);
    list.forEach(id => this.stopTrack(id));
  }

  // --- Internal Procedural Generators ---

  _generateNoiseBuffer(duration = 3) {
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    // Pink noise filtering
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Gain compensation
    }
    return buffer;
  }

  _createRainGenerator(targetNode) {
    const noise = this.ctx.createBufferSource();
    noise.buffer = this._generateNoiseBuffer(4);
    noise.loop = true;

    const biquad = this.ctx.createBiquadFilter();
    biquad.type = 'lowpass';
    biquad.frequency.setValueAtTime(1200, this.ctx.currentTime);

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(400, this.ctx.currentTime);

    noise.connect(biquad);
    biquad.connect(highpass);
    highpass.connect(targetNode);
    noise.start();

    return () => {
      try {
        noise.stop();
        noise.disconnect();
      } catch {}
    };
  }

  _createOceanGenerator(targetNode) {
    const noise = this.ctx.createBufferSource();
    noise.buffer = this._generateNoiseBuffer(5);
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, this.ctx.currentTime);

    const waveGain = this.ctx.createGain();
    waveGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

    // LFO to simulate sweeping ocean waves
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // ~8 sec wave period
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);

    noise.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(targetNode);

    lfo.start();
    noise.start();

    return () => {
      try {
        noise.stop();
        lfo.stop();
        noise.disconnect();
        lfo.disconnect();
      } catch {}
    };
  }

  _createCafeGenerator(targetNode) {
    const noise = this.ctx.createBufferSource();
    noise.buffer = this._generateNoiseBuffer(3);
    noise.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(800, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(0.6, this.ctx.currentTime);

    noise.connect(bandpass);
    bandpass.connect(targetNode);
    noise.start();

    return () => {
      try {
        noise.stop();
        noise.disconnect();
      } catch {}
    };
  }

  _createStreamGenerator(targetNode) {
    const noise = this.ctx.createBufferSource();
    noise.buffer = this._generateNoiseBuffer(3);
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(targetNode);
    noise.start();

    return () => {
      try {
        noise.stop();
        noise.disconnect();
      } catch {}
    };
  }

  _createBirdsGenerator(targetNode) {
    let intervalId = null;
    const playChirp = () => {
      if (!this.ctx || this.ctx.state !== 'running') return;
      try {
        const osc = this.ctx.createOscillator();
        const chirpGain = this.ctx.createGain();
        osc.type = 'sine';
        const startFreq = 2600 + Math.random() * 1200;
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 1.5, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 0.9, now + 0.16);

        chirpGain.gain.setValueAtTime(0.01, now);
        chirpGain.gain.linearRampToValueAtTime(0.12, now + 0.04);
        chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(chirpGain);
        chirpGain.connect(targetNode);
        osc.start(now);
        osc.stop(now + 0.22);
      } catch {}
    };

    intervalId = setInterval(() => {
      if (Math.random() > 0.4) playChirp();
    }, 2800);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }

  _createFireGenerator(targetNode) {
    const noise = this.ctx.createBufferSource();
    noise.buffer = this._generateNoiseBuffer(3);
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(targetNode);
    noise.start();

    // Occasional crackle pops
    const interval = setInterval(() => {
      if (!this.ctx) return;
      try {
        const popOsc = this.ctx.createOscillator();
        const popGain = this.ctx.createGain();
        const now = this.ctx.currentTime;
        popOsc.type = 'square';
        popOsc.frequency.setValueAtTime(250 + Math.random() * 400, now);
        popGain.gain.setValueAtTime(0.08, now);
        popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        popOsc.connect(popGain);
        popGain.connect(targetNode);
        popOsc.start(now);
        popOsc.stop(now + 0.04);
      } catch {}
    }, 900);

    return () => {
      clearInterval(interval);
      try {
        noise.stop();
        noise.disconnect();
      } catch {}
    };
  }

  _createLofiGenerator(targetNode) {
    // Calming 4-chord electric piano / Rhodes synthesis progression
    const chordProgressions = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 349.23]  // G7
    ];
    let step = 0;
    let interval = null;

    const playChord = () => {
      if (!this.ctx || this.ctx.state !== 'running') return;
      const notes = chordProgressions[step % chordProgressions.length];
      step++;
      const now = this.ctx.currentTime;
      notes.forEach(freq => {
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(700, now);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.06, now + 0.4);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(targetNode);

          osc.start(now);
          osc.stop(now + 4.5);
        } catch {}
      });
    };

    playChord();
    interval = setInterval(playChord, 4600);

    return () => {
      if (interval) clearInterval(interval);
    };
  }

  _createWhiteNoiseGenerator(targetNode) {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    noise.connect(targetNode);
    noise.start();

    return () => {
      try {
        noise.stop();
        noise.disconnect();
      } catch {}
    };
  }
}

export const soundEngine = new SoundEngine();
