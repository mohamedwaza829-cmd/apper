/**
 * Specialized Web Audio API Mindfulness Synthesizer Engine
 * Generates custom atmospheric pads, solfeggio healing frequencies,
 * binaural brainwave beats, and breathing guidelines in real-time.
 */

export interface SynthesizerConfig {
  sessionId: string;
  category: string;
  title: string;
  duration: number; // in minutes
}

export class SessionSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  
  // Oscillators and nodes for Binaural beats
  private leftOsc: OscillatorNode | null = null;
  private rightOsc: OscillatorNode | null = null;
  private leftGain: GainNode | null = null;
  private rightGain: GainNode | null = null;
  private merger: ChannelMergerNode | null = null;

  // Nodes for Ambient Chords / Drones
  private padOscillators: OscillatorNode[] = [];
  private padGain: GainNode | null = null;
  private padFilter: BiquadFilterNode | null = null;
  private padLfo: OscillatorNode | null = null;
  private padLfoGain: GainNode | null = null;

  // Nodes for Ocean Waves / Breathing Respiratory guide
  private noiseNode: AudioWorkletNode | ScriptProcessorNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private noiseGain: GainNode | null = null;
  private oceanInterval: any = null;

  // Nodes for Chimes
  private chimeTimer: any = null;
  private chimeVolume: GainNode | null = null;

  // Active playing variables
  private activeConfig: SynthesizerConfig | null = null;
  private isSynthesizing: boolean = false;
  private baseFreq: number = 432;
  private beatDelta: number = 6.0;
  private chordIntervals: number[] = [1, 1.2, 1.5, 1.8];

  // Volume parameters (0 - 1)
  public musicVol = 0.6;
  public beatsVol = 0.35;
  public natureVol = 0.4;
  public chimeVol = 0.5;

  constructor() {}

  /**
   * Initializes or returns the audio context safely following browser user interaction rules
   */
  private initContext(): AudioContext {
    if (!this.ctx) {
      // Support legacy web browsers
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    return this.ctx;
  }

  /**
   * Starts generating custom designed ambient audio
   */
  public start(config: SynthesizerConfig, customFrequency?: number) {
    this.stop();
    this.activeConfig = config;
    this.isSynthesizing = true;

    try {
      const ctx = this.initContext();
      
      // 1. Create Master Output structure
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      // Fade in smoothly over 1.5 seconds
      this.masterGain.gain.exponentialRampToValueAtTime(1.0, ctx.currentTime + 1.5);
      this.masterGain.connect(ctx.destination);

      // Determine sound parameters based on requested session
      const id = config.sessionId;
      const category = config.category;

      let baseFreq = customFrequency || 432;      // Golden Solfeggio / cosmic tuning
      let chordIntervals = [1, 1.2, 1.5, 1.8]; // Perfect major stack (root, third, fifth, octave)
      let beatDelta = 6.0;      // Theta waves (6Hz) default
      let waveSpeed = 5.0;      // 5 seconds breath cycle (Inhale 2.5s / Exhale 2.5s)
      let noiseType: 'ocean' | 'wind' | 'pure' = 'ocean';

      // Advanced session mapping matching exactly the titles requested
      // Meditation Categories: focus, relaxation, sleep, stressRelief, breathing
      // Yoga Genres: beginner, intermediate, advanced

      if (id === 'm1' || id === 'breathing' || config.title.includes('تنفس') || config.title.includes('Breath')) {
        // Morning Breath / Freshness focus
        if (!customFrequency) baseFreq = 432; // Natural clarity
        chordIntervals = [1, 1.25, 1.5, 1.875]; // Bright Major 7th
        beatDelta = 10.0; // Alpha waves (10Hz) for relaxed wakefulness
        waveSpeed = 4.5; // Slightly faster breathing focus
      } else if (id === 'm2' || id === 'relaxation' || config.title.includes('استرخاء مسائي') || config.title.includes('Evening')) {
        // Evening relaxation / calming dusk
        if (!customFrequency) baseFreq = 396; // Solfeggio liberating stress and anxiety
        chordIntervals = [1, 1.2, 1.5, 1.8]; // Root minor Stack
        beatDelta = 5.5; // Lower theta calming
        waveSpeed = 6.0; // Slow calm breath cycle
      } else if (id === 'm3' || id === 'sleep' || config.title.includes('نوم') || config.title.includes('Sleep')) {
        // Deep Sleep
        if (!customFrequency) baseFreq = 174; // Deep physical ease solfeggio frequency
        chordIntervals = [1, 1.125, 1.5, 1.6]; // Hypnotic dream elements
        beatDelta = 2.5; // Extreme calming Delta waves (2.5Hz) for REM trigger
        waveSpeed = 7.0; // Deepest relaxation breath cadence
      } else if (id === 'm4' || id === 'stressRelief' || config.title.includes('توتر') || config.title.includes('Stress')) {
        // Stress relief
        if (!customFrequency) baseFreq = 741; // Purification & mental liberation solfeggio tone
        chordIntervals = [1, 1.2, 1.333, 1.6]; // Healing suspended harmonies
        beatDelta = 4.0; // Low theta / high delta (4Hz)
        waveSpeed = 5.5;
      } else if (id === 'y1' || config.title.includes('يوغا الصباح') || config.title.includes('Morning Yoga')) {
        // Morning yoga for beginners
        if (!customFrequency) baseFreq = 528; // Transformation, DNA repair and clarity
        chordIntervals = [1, 1.25, 1.5, 1.875]; // Revitalizing morning stack
        beatDelta = 8.5; // High Theta / Low Alpha (8.5Hz)
        waveSpeed = 5.0;
      } else if (id === 'y2' || config.title.includes('تدفق') || config.title.includes('Energy')) {
        // Energy Flow
        if (!customFrequency) baseFreq = 528; // Vitality
        chordIntervals = [1, 1.333, 1.5, 2.0]; // Perfect fourth focus (Dynamic, motivating)
        beatDelta = 12.0; // Active alert Beta/Alpha beat (12Hz)
        waveSpeed = 4.0; // Energetic pacing
      } else if (id === 'y3' || config.title.includes('مرونة') || config.title.includes('Flexibility')) {
        // Advanced Flexibility
        if (!customFrequency) baseFreq = 639; // Cell communication and connection
        chordIntervals = [1, 1.2, 1.5, 1.6]; // Introspective chords
        beatDelta = 4.5; // Letting go frequency (4.5Hz theta)
        waveSpeed = 6.5; // Very slow holding postures
      } else if (id === 'y4' || config.title.includes('استرخاء') || config.title.includes('Relaxation')) {
        // Yoga for relaxation
        if (!customFrequency) baseFreq = 432;
        chordIntervals = [1, 1.2, 1.5, 1.8]; // Minor chill stack
        beatDelta = 6.0;
        waveSpeed = 5.8;
      }

      this.baseFreq = baseFreq;
      this.beatDelta = beatDelta;
      this.chordIntervals = chordIntervals;

      // Start Synthesizer Channels
      this.playBinauralBeats(ctx, this.baseFreq, this.beatDelta);
      this.playAmbientPads(ctx, this.baseFreq, this.chordIntervals);
      this.playBreathingNature(ctx, waveSpeed, noiseType);
      this.startChimeSequencer(ctx, this.baseFreq);

    } catch (e) {
      console.error("Failed to boot real-time synth audio nodes:", e);
    }
  }

  /**
   * Method 1: Synthesizes real binaural brainwaves customized left/right
   */
  private playBinauralBeats(ctx: AudioContext, base: number, delta: number) {
    this.leftOsc = ctx.createOscillator();
    this.rightOsc = ctx.createOscillator();
    
    this.leftGain = ctx.createGain();
    this.rightGain = ctx.createGain();
    this.merger = ctx.createChannelMerger(2);

    // Left Frequency = Base freq minus half the binaural delta
    this.leftOsc.type = 'sine';
    this.leftOsc.frequency.setValueAtTime(base - (delta / 2), ctx.currentTime);

    // Right Frequency = Base freq plus half the binaural delta
    this.rightOsc.type = 'sine';
    this.rightOsc.frequency.setValueAtTime(base + (delta / 2), ctx.currentTime);

    // Adjust sub volume elegantly
    this.leftGain.gain.setValueAtTime(this.beatsVol * 0.15, ctx.currentTime);
    this.rightGain.gain.setValueAtTime(this.beatsVol * 0.15, ctx.currentTime);

    // Map left & right oscillators to direct left & right ears (stereo separation)
    this.leftOsc.connect(this.leftGain);
    this.rightOsc.connect(this.rightGain);

    this.leftGain.connect(this.merger, 0, 0); // left input to left merger output
    this.rightGain.connect(this.merger, 0, 1); // right input to right merger output

    // Connect merger to master output
    if (this.masterGain) {
      this.merger.connect(this.masterGain);
    }

    // Fire oscillators
    this.leftOsc.start(0);
    this.rightOsc.start(0);
  }

  /**
   * Method 2: Synthesizes rich solar healing major/minor ambient chord pads
   */
  private playAmbientPads(ctx: AudioContext, base: number, intervals: number[]) {
    this.padGain = ctx.createGain();
    this.padGain.gain.setValueAtTime(this.musicVol * 0.25, ctx.currentTime);

    this.padFilter = ctx.createBiquadFilter();
    this.padFilter.type = 'lowpass';
    this.padFilter.frequency.setValueAtTime(450, ctx.currentTime);
    this.padFilter.Q.setValueAtTime(2.5, ctx.currentTime);

    // Create 4 harmonic oscillators working in unison for dense chords
    this.padOscillators = intervals.map((multiplier, idx) => {
      const osc = ctx.createOscillator();
      // Alternating waveform types for organic harmonic richness
      osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(base * multiplier * 0.5, ctx.currentTime); // one octave lower for drone richness
      
      const oscVolume = ctx.createGain();
      // De-correlate each oscillator slightly for absolute spacious phase
      oscVolume.gain.setValueAtTime(0.18, ctx.currentTime);
      osc.connect(oscVolume);
      oscVolume.connect(this.padFilter!);
      return osc;
    });

    // Create a slow low-frequency oscillator (LFO) to modulate the lowpass cutoff (creating ocean swell sounds)
    this.padLfo = ctx.createOscillator();
    this.padLfo.frequency.setValueAtTime(0.08, ctx.currentTime); // ultra-slow (12.5 seconds per cycle)
    this.padLfoGain = ctx.createGain();
    this.padLfoGain.gain.setValueAtTime(220, ctx.currentTime); // sweep between 230Hz and 670Hz

    // Hook up LFO to filter frequency parameter for direct modulation
    this.padLfo.connect(this.padLfoGain);
    this.padLfoGain.connect(this.padFilter.frequency);

    // Connect filter chain to master
    if (this.masterGain) {
      this.padFilter.connect(this.padGain);
      this.padGain.connect(this.masterGain);
    }

    // Launch all pads and slow filters
    this.padLfo.start(0);
    this.padOscillators.forEach(osc => osc.start(0));
  }

  /**
   * Method 3: Synthesizes simulated white noise filtered into breathing ocean waves
   */
  private playBreathingNature(ctx: AudioContext, breathSpeed: number, type: string) {
    // Generate pinkish/white noise using HTML5 safe ScriptProcessor
    const bufferSize = 4 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    // Fill the buffer with white noise values
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    this.noiseFilter = ctx.createBiquadFilter();
    this.noiseFilter.type = 'bandpass';
    this.noiseFilter.frequency.setValueAtTime(320, ctx.currentTime);
    this.noiseFilter.Q.setValueAtTime(1.2, ctx.currentTime);

    this.noiseGain = ctx.createGain();
    this.noiseGain.gain.setValueAtTime(this.natureVol * 0.12, ctx.currentTime);

    // Route noise source
    noiseSource.connect(this.noiseFilter);
    this.noiseFilter.connect(this.noiseGain);
    
    if (this.masterGain) {
      this.noiseGain.connect(this.masterGain);
    }

    noiseSource.start(0);

    // Breathing sweep scheduler (modulating the bandpass frequency to simulate deep ocean breath)
    let isInhale = true;
    const updateBreath = () => {
      if (!this.isSynthesizing || !this.noiseFilter || !this.ctx) return;
      const now = this.ctx.currentTime;
      const targetFreq = isInhale ? 720 : 180;
      const targetGain = isInhale ? this.natureVol * 0.22 : this.natureVol * 0.06;
      
      this.noiseFilter.frequency.exponentialRampToValueAtTime(targetFreq, now + breathSpeed);
      this.noiseGain?.gain.linearRampToValueAtTime(targetGain, now + breathSpeed);
      
      isInhale = !isInhale;
    };

    // Trigger initial breath
    updateBreath();
    this.oceanInterval = setInterval(updateBreath, breathSpeed * 1000);
  }

  /**
   * Method 4: Chime Sequencer triggers magical bell ringing like an ancient temple
   */
  private startChimeSequencer(ctx: AudioContext, base: number) {
    this.chimeVolume = ctx.createGain();
    this.chimeVolume.gain.setValueAtTime(this.chimeVol * 0.2, ctx.currentTime);
    
    if (this.masterGain) {
      this.chimeVolume.connect(this.masterGain);
    }

    const playRandomChime = () => {
      if (!this.isSynthesizing || !this.ctx || !this.chimeVolume) return;
      const now = this.ctx.currentTime;

      // Select a beautiful random solfeggio harmonic scale degree
      const scaleDegrees = [1.0, 1.25, 1.5, 1.875, 2.0, 2.5];
      const degree = scaleDegrees[Math.floor(Math.random() * scaleDegrees.length)];
      const ringFreq = base * degree * 1.5; // pristine crystal clear octave chime

      // Simple additive bell sound synthesis: 3 waves (Fundamental, minor third, pure high octave)
      const primaryOsc = this.ctx.createOscillator();
      const supportOsc = this.ctx.createOscillator();
      
      const chimeGain = this.ctx.createGain();

      primaryOsc.type = 'sine';
      primaryOsc.frequency.setValueAtTime(ringFreq, now);

      supportOsc.type = 'triangle';
      supportOsc.frequency.setValueAtTime(ringFreq * 1.2, now); // slightly detuned ring component

      // Crystal chime decay simulation
      chimeGain.gain.setValueAtTime(0.001, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.24, now + 0.05); // immediate glassy strike
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.8); // 4.8 seconds lingering ring-out decay

      // Connect chime nodes
      primaryOsc.connect(chimeGain);
      supportOsc.connect(chimeGain);
      chimeGain.connect(this.chimeVolume);

      // Fire chimes
      primaryOsc.start(now);
      supportOsc.start(now);

      primaryOsc.stop(now + 5.0);
      supportOsc.stop(now + 5.0);
    };

    // Chime intervals every 12 to 18 seconds randomized beautifully
    const chimeLoop = () => {
      playRandomChime();
      const nextDelay = 12000 + Math.random() * 8000;
      this.chimeTimer = setTimeout(chimeLoop, nextDelay);
    };

    // Ring initial chime after 4 seconds
    this.chimeTimer = setTimeout(chimeLoop, 4000);
  }

  /**
   * Updates the core base solfeggio frequency in real-time
   */
  public updateFrequency(base: number) {
    this.baseFreq = base;
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. Update Binaural Beats frequencies
    if (this.leftOsc && this.rightOsc) {
      this.leftOsc.frequency.exponentialRampToValueAtTime(Math.max(10, base - (this.beatDelta / 2)), now + 0.5);
      this.rightOsc.frequency.exponentialRampToValueAtTime(Math.max(10, base + (this.beatDelta / 2)), now + 0.5);
    }

    // 2. Update Ambient Pad frequencies
    if (this.padOscillators && this.padOscillators.length > 0) {
      this.padOscillators.forEach((osc, idx) => {
        const multiplier = this.chordIntervals[idx] || 1;
        osc.frequency.exponentialRampToValueAtTime(Math.max(10, base * multiplier * 0.5), now + 0.5);
      });
    }
  }

  /**
   * Hot-reloads volume modifications instantly during live user synthesis
   */
  public updateVolumes(music: number, beats: number, nature: number, chime: number) {
    this.musicVol = music;
    this.beatsVol = beats;
    this.natureVol = nature;
    this.chimeVol = chime;

    if (this.ctx) {
      const now = this.ctx.currentTime;
      if (this.padGain) this.padGain.gain.linearRampToValueAtTime(music * 0.25, now + 0.2);
      if (this.leftGain) this.leftGain.gain.linearRampToValueAtTime(beats * 0.15, now + 0.2);
      if (this.rightGain) this.rightGain.gain.linearRampToValueAtTime(beats * 0.15, now + 0.2);
      if (this.noiseGain) this.noiseGain.gain.linearRampToValueAtTime(nature * 0.12, now + 0.2);
      if (this.chimeVolume) this.chimeVolume.gain.linearRampToValueAtTime(chime * 0.2, now + 0.2);
    }
  }

  /**
   * Completely terminates all synthetic sound generation and clears RAM safely
   */
  public stop() {
    this.isSynthesizing = false;

    if (this.oceanInterval) {
      clearInterval(this.oceanInterval);
      this.oceanInterval = null;
    }

    if (this.chimeTimer) {
      clearTimeout(this.chimeTimer);
      this.chimeTimer = null;
    }

    // Stop and clear all oscillators
    this.padOscillators.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    this.padOscillators = [];

    if (this.leftOsc) {
      try { this.leftOsc.stop(); } catch(e) {}
      this.leftOsc = null;
    }
    if (this.rightOsc) {
      try { this.rightOsc.stop(); } catch(e) {}
      this.rightOsc = null;
    }
    if (this.padLfo) {
      try { this.padLfo.stop(); } catch(e) {}
      this.padLfo = null;
    }

    // Disconnect active nodes
    this.leftGain = null;
    this.rightGain = null;
    this.merger = null;
    this.padGain = null;
    this.padFilter = null;
    this.padLfoGain = null;
    this.noiseFilter = null;
    this.noiseGain = null;
    this.chimeVolume = null;

    if (this.masterGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        // Disconnect after ramp completes
        const g = this.masterGain;
        setTimeout(() => {
          try { g.disconnect(); } catch (e) {}
        }, 350);
      } catch (err) {}
      this.masterGain = null;
    }

    // Clean active states
    this.activeConfig = null;
  }
}

// Single active speaker instance globally to avoid multiple ambient sounds overlaying
export const globalMindfulnessSynth = new SessionSynthesizer();
