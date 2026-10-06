// Web Audio API procedural synthesizer for game sound effects
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('arena_sound_muted');
      this.isMuted = saved === 'true';
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('arena_sound_muted', String(this.isMuted));
    }
    return this.isMuted;
  }

  // Card flip click sound
  public playFlip() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Ignore audio errors gracefully
    }
  }

  // Pair matched sound (harmonic chime)
  public playMatch(comboLevel: number = 1) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const baseFreq = 440 * Math.pow(1.1, Math.min(comboLevel - 1, 6)); // ascending pitch on combos
      const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5]; // major triad

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteStart = now + idx * 0.06;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.15, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.28);
      });
    } catch {
      // Ignore audio errors
    }
  }

  // Mismatch sound (gentle low thud)
  public playMismatch() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(120, now + 0.15);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Ignore
    }
  }

  // Hint peek sound
  public playHint() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.2); // A5

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Ignore
    }
  }

  // Victory fanfare sound
  public playVictory() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [
        { f: 523.25, d: 0.15, s: 0 },    // C5
        { f: 659.25, d: 0.15, s: 0.15 }, // E5
        { f: 783.99, d: 0.18, s: 0.3 },  // G5
        { f: 1046.50, d: 0.45, s: 0.48 } // C6
      ];

      notes.forEach(({ f, d, s }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + s;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, start);

        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + d);
      });
    } catch {
      // Ignore
    }
  }

  // Super Mario classic retro jump sound
  public playMarioJump() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.16);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Ignore
    }
  }

  // Super Mario 2-tone coin chime
  public playMarioCoin() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Tone 1: B5 (987.77 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(987.77, now);
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.08);

      // Tone 2: E6 (1318.51 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.51, now + 0.08);
      gain2.gain.setValueAtTime(0.2, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.35);
    } catch {
      // Ignore
    }
  }

  // Super Mario stomp enemy sound
  public playMarioStomp() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Ignore
    }
  }

  // Super Mario powerup sound (ascending arpeggio)
  public playMarioPowerup() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const freqs = [330, 392, 659, 523, 587, 784];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + i * 0.06;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.08);
      });
    } catch {
      // Ignore
    }
  }

  // Super Mario game over / lose life sound
  public playMarioDie() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [
        { f: 500, d: 0.12, s: 0 },
        { f: 450, d: 0.12, s: 0.12 },
        { f: 400, d: 0.12, s: 0.24 },
        { f: 320, d: 0.25, s: 0.36 }
      ];
      notes.forEach(({ f, d, s }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + s;
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, start);
        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + d);
      });
    } catch {
      // Ignore
    }
  }

  // Flagpole / Level clear fanfare
  public playMarioLevelClear() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [
        { f: 523.25, d: 0.1, s: 0 },
        { f: 659.25, d: 0.1, s: 0.1 },
        { f: 783.99, d: 0.1, s: 0.2 },
        { f: 1046.50, d: 0.15, s: 0.3 },
        { f: 1318.51, d: 0.3, s: 0.45 }
      ];
      notes.forEach(({ f, d, s }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + s;
        osc.type = 'square';
        osc.frequency.setValueAtTime(f, start);
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + d);
      });
    } catch {
      // Ignore
    }
  }

  // --- TARZAN NA FLORESTA SOUNDS ---

  // Athletic jump sound
  public playTarzanJump() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Ignore
    }
  }

  // Grab vine (cipó) swoosh
  public playTarzanVineGrab() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.14);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } catch {
      // Ignore
    }
  }

  // Release vine swing / soar
  public playTarzanVineRelease() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.2);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Ignore
    }
  }

  // The legendary Tarzan Jungle Cry / Grito de Tarzan
  public playTarzanYell() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Synthesize harmonic yodel pattern: Aaaa-u-Aaaa-u-Aaaaaah!
      const yellNotes = [
        { f: 440, d: 0.12, s: 0.0 },    // A4
        { f: 659, d: 0.14, s: 0.12 },   // E5
        { f: 440, d: 0.12, s: 0.26 },   // A4
        { f: 784, d: 0.18, s: 0.38 },   // G5
        { f: 659, d: 0.14, s: 0.56 },   // E5
        { f: 880, d: 0.35, s: 0.70 },   // A5 final hold with vibrato
      ];
      yellNotes.forEach(({ f, d, s }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + s;
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, start);
        // Add subtle pitch slide
        osc.frequency.linearRampToValueAtTime(f * 1.03, start + d * 0.8);
        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + d);
      });
    } catch {
      // Ignore
    }
  }

  // Collect jungle banana or fruit
  public playBananaCollect() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.08); // A5
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Ignore
    }
  }

  // Throw coconut weapon
  public playCoconutThrow() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Ignore
    }
  }

  // Coconut impact on beast or rock
  public playCoconutHit() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.15);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Ignore
    }
  }

  // Beast roar (Jaguar / Croc)
  public playJungleGrowl() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.25);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch {
      // Ignore
    }
  }

  // Tarzan takes hit / falls
  public playTarzanDamage() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Ignore
    }
  }

  // Tarzan victory jungle fanfare
  public playTarzanVictory() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const fanfare = [
        { f: 392, d: 0.15, s: 0.0 },    // G4
        { f: 523.25, d: 0.15, s: 0.15 }, // C5
        { f: 659.25, d: 0.18, s: 0.30 }, // E5
        { f: 783.99, d: 0.35, s: 0.48 }, // G5
        { f: 1046.5, d: 0.5, s: 0.85 },  // C6
      ];
      fanfare.forEach(({ f, d, s }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + s;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, start);
        gain.gain.setValueAtTime(0.22, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + d);
      });
    } catch {
      // Ignore
    }
  }

  // Duolingo-style crisp two-tone correct chime (C5 -> E5 -> G5)
  public playDuoCorrect() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [
        { f: 587.33, d: 0.12, s: 0.0 },   // D5
        { f: 880.0, d: 0.28, s: 0.09 },   // A5
      ];
      notes.forEach(({ f, d, s }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + s;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, start);
        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + d);
      });
    } catch {
      // Ignore
    }
  }

  // Duolingo-style gentle incorrect buzz
  public playDuoWrong() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [
        { f: 260, d: 0.12, s: 0.0 },
        { f: 220, d: 0.22, s: 0.1 },
      ];
      notes.forEach(({ f, d, s }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + s;
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, start);
        gain.gain.setValueAtTime(0.1, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + d);
      });
    } catch {
      // Ignore
    }
  }

  // Duolingo gem collect sound
  public playDuoGem() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.5, now); // C6
      osc.frequency.exponentialRampToValueAtTime(1567.98, now + 0.15); // G6
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Ignore
    }
  }

  // Duolingo level complete fanfare
  public playDuoLevelComplete() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const melody = [
        { f: 523.25, d: 0.1, s: 0.0 },   // C5
        { f: 659.25, d: 0.1, s: 0.1 },   // E5
        { f: 783.99, d: 0.1, s: 0.2 },   // G5
        { f: 1046.5, d: 0.35, s: 0.32 }, // C6
      ];
      melody.forEach(({ f, d, s }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + s;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, start);
        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + d);
      });
    } catch {
      // Ignore
    }
  }

  // Speech synthesis for native English pronunciation
  public speakEnglish(text: string, rate: number = 0.95) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[^a-zA-Z0-9\s'?!]/g, '').trim();
      if (!cleanText) return;
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-US';
      utterance.rate = rate;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(
        (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Alex'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore speech synthesis errors gracefully
    }
  }

  // Speech synthesis for Portuguese pronunciation
  public speakPortuguese(text: string, rate: number = 1.0) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[^a-zA-Z0-9áàâãéèêíïóôõöúçÁÀÂÃÉÈÍÓÔÕÚÇ\s'?!]/g, '').trim();
      if (!cleanText) return;
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'pt-BR';
      utterance.rate = rate;

      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find(
        (v) => v.lang.startsWith('pt') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Luciana') || v.name.includes('Yelda'))
      ) || voices.find((v) => v.lang.startsWith('pt'));

      if (ptVoice) {
        utterance.voice = ptVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore speech synthesis errors gracefully
    }
  }

  // Speech synthesis for slow Portuguese pronunciation (ideal for reading and literacy study)
  public speakSlow(text: string) {
    this.speakPortuguese(text, 0.65);
  }

  // Speaks syllables with clear micro-pauses for reading practice
  public speakSyllables(syllables: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Replace bullets or dashes with commas for natural speech pausing
      const pauseText = syllables.replace(/[•\-\/]/g, ', ');
      const utterance = new SpeechSynthesisUtterance(pauseText);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.75;
      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find((v) => v.lang.startsWith('pt'));
      if (ptVoice) utterance.voice = ptVoice;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore
    }
  }

  // Bilingual pronunciation (speaks English first, then Portuguese)
  public speakBilingual(enText: string, ptText: string, rate: number = 0.95) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const enUtterance = new SpeechSynthesisUtterance(enText.replace(/[^a-zA-Z0-9\s'?!]/g, '').trim());
      enUtterance.lang = 'en-US';
      enUtterance.rate = rate;

      const ptUtterance = new SpeechSynthesisUtterance(ptText.replace(/[^a-zA-Z0-9áàâãéèêíïóôõöúçÁÀÂÃÉÈÍÓÔÕÚÇ\s'?!]/g, '').trim());
      ptUtterance.lang = 'pt-BR';
      ptUtterance.rate = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find((v) => v.lang.startsWith('en'));
      const ptVoice = voices.find((v) => v.lang.startsWith('pt'));

      if (englishVoice) enUtterance.voice = englishVoice;
      if (ptVoice) ptUtterance.voice = ptVoice;

      window.speechSynthesis.speak(enUtterance);
      setTimeout(() => {
        window.speechSynthesis.speak(ptUtterance);
      }, 700);
    } catch {
      // Ignore
    }
  }
}

export const soundManager = new SoundEngine();
