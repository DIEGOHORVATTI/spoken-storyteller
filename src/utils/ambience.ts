import { AmbienceType } from '../types';

class AmbienceEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentType: AmbienceType = 'none';
  private activeNodes: (AudioNode | number)[] = [];
  private volume: number = 0.3;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public setAmbience(type: AmbienceType) {
    this.stop();
    this.currentType = type;

    if (type === 'none') return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (type === 'medieval') {
      this.createMedievalMusic();
    } else if (type === 'fire') {
      this.createFireSound();
    } else if (type === 'rain') {
      this.createRainSound();
    } else if (type === 'magic') {
      this.createMagicSound();
    }
  }

  public getCurrentType(): AmbienceType {
    return this.currentType;
  }

  public stop() {
    if (!this.ctx) return;
    // Clear any timers
    this.activeNodes.forEach((item) => {
      if (typeof item === 'number') {
        window.clearInterval(item);
      } else {
        try {
          if ('stop' in item && typeof (item as AudioScheduledSourceNode).stop === 'function') {
            (item as AudioScheduledSourceNode).stop();
          }
          item.disconnect();
        } catch {
          // ignore disconnect errors
        }
      }
    });
    this.activeNodes = [];
    this.currentType = 'none';
  }

  private createMedievalMusic() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // 1. Warm tavern drone / organ pedal in D Dorian (D2 = 73.42Hz, A2 = 110Hz)
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.04;
    droneGain.connect(this.masterGain);

    [73.42, 110.0, 146.83].forEach((f, idx) => {
      const droneOsc = ctx.createOscillator();
      droneOsc.type = 'triangle';
      droneOsc.frequency.value = f;
      droneOsc.detune.value = (idx - 1) * 3;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 220;

      droneOsc.connect(filter);
      filter.connect(droneGain);
      droneOsc.start();
      this.activeNodes.push(droneOsc, filter);
    });
    this.activeNodes.push(droneGain);

    // 2. Medieval lute / Celtic harp arpeggiator in D Dorian scale (D, E, F, G, A, B, C, D)
    // Warm lute plucked notes with quick exponential decay
    const notesFreqs = [
      146.83, // D3
      164.81, // E3
      174.61, // F3
      196.00, // G3
      220.00, // A3
      246.94, // B3
      261.63, // C4
      293.66, // D4
      329.63, // E4
      349.23, // F4
      440.00, // A4
    ];

    // Medieval melancholic tavern melody sequence (note indices)
    const melodyPattern = [
      0, 4, 7, 4, 3, 2, 0, 4,
      1, 4, 6, 4, 2, 0, 4, 7,
      7, 8, 9, 8, 7, 4, 2, 3,
      4, 2, 0, 2, 0, 4, 7, 0,
    ];

    let step = 0;
    const noteInterval = 520; // gentle, unhurried medieval tempo

    const playLutePluck = (freq: number, isAccent: boolean = false) => {
      if (!this.ctx || !this.masterGain || this.currentType !== 'medieval') return;
      const t = this.ctx.currentTime;

      // Dual harmonic oscillator for rich plucked acoustic string timbre (fundamental + harmonic)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const pluckFilter = this.ctx.createBiquadFilter();
      const pluckGain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, t);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(freq * 2, t);

      pluckFilter.type = 'lowpass';
      pluckFilter.frequency.setValueAtTime(isAccent ? 1800 : 1200, t);
      pluckFilter.frequency.exponentialRampToValueAtTime(300, t + 1.2);

      const amp = isAccent ? 0.055 : 0.038;
      pluckGain.gain.setValueAtTime(amp, t);
      pluckGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);

      osc1.connect(pluckFilter);
      osc2.connect(pluckFilter);
      pluckFilter.connect(pluckGain);
      pluckGain.connect(this.masterGain);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 1.5);
      osc2.stop(t + 1.5);
    };

    const intervalId = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || this.currentType !== 'medieval') return;

      const noteIdx = melodyPattern[step % melodyPattern.length];
      const freq = notesFreqs[noteIdx % notesFreqs.length];
      const isAccent = step % 8 === 0;

      playLutePluck(freq, isAccent);

      // Occasional gentle harmony pluck (5th interval)
      if (step % 4 === 0) {
        const bassFreq = notesFreqs[0]; // D3
        playLutePluck(bassFreq, false);
      }

      step++;
    }, noteInterval);

    this.activeNodes.push(intervalId);
  }

  private createFireSound() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Pink-noise like background roar (gentle low rumble of cabin fireplace)
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to warm bass
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 350;

    const fireGain = ctx.createGain();
    fireGain.gain.value = 0.8;

    whiteNoise.connect(filter);
    filter.connect(fireGain);
    fireGain.connect(this.masterGain);
    whiteNoise.start();

    this.activeNodes.push(whiteNoise, filter, fireGain);

    // Random wood crackles
    const interval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain || this.currentType !== 'fire') return;
      if (Math.random() > 0.4) {
        this.triggerFireCrackle();
      }
    }, 180);

    this.activeNodes.push(interval);
  }

  private triggerFireCrackle() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    const freq = 600 + Math.random() * 2400;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq, ctx.currentTime);
    filter.Q.value = 8;

    const dur = 0.01 + Math.random() * 0.04;
    const amp = 0.08 + Math.random() * 0.15;
    gain.gain.setValueAtTime(amp, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(ctx.currentTime + dur);
  }

  private createRainSound() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Rain white/pink noise filter
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.09;
    }

    const rainSource = ctx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 1000;

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 250;

    const rainGain = ctx.createGain();
    rainGain.gain.value = 0.45;

    rainSource.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(rainGain);
    rainGain.connect(this.masterGain);
    rainSource.start();

    this.activeNodes.push(rainSource, highpass, lowpass, rainGain);
  }

  private createMagicSound() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Ambient ethereal harmonic chord (Dragon God Mana sanctuary)
    const baseFreqs = [110, 164.81, 220, 329.63]; // A chord
    baseFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

      osc.type = 'sine';
      osc.frequency.value = freq;

      // Gentle subtle detune for warmth
      osc.detune.value = (idx - 1.5) * 4;

      oscGain.gain.value = 0.08 / (idx + 1);

      if (panner) {
        panner.pan.value = (idx % 2 === 0 ? -0.4 : 0.4);
        osc.connect(oscGain);
        oscGain.connect(panner);
        panner.connect(this.masterGain!);
        this.activeNodes.push(panner);
      } else {
        osc.connect(oscGain);
        oscGain.connect(this.masterGain!);
      }

      osc.start();
      this.activeNodes.push(osc, oscGain);
    });
  }
}

export const ambienceEngine = new AmbienceEngine();
