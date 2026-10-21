/**
 * PocketKit Tactile Haptic & Audio Feedback Engine
 * Provides multi-layered physical vibration & audible feedback for users with visual impairments.
 * Fully supports:
 * 1. Native Android WebView bridge (via window.AndroidApp.performHapticFeedback)
 * 2. Web Vibration API (navigator.vibrate)
 * 3. Synthetic mechanical earcon click fallback via Web Audio API for devices without vibration motors
 */

export type HapticType =
  | 'selection' // 12ms subtle tick for hovering/focusing tools, category changes, tab switching
  | 'light'     // 18ms soft click for regular button taps, dropdowns, filters
  | 'medium'    // 35ms solid feedback for opening modals, launching tools, calculate, convert
  | 'heavy'     // 55ms pronounced pulse for download APK, reset, erase
  | 'success'   // [30, 40, 45]ms celebratory rhythm for copied, completed tasks, valid hash
  | 'error'     // [60, 40, 60]ms distinct warning double-buzz for syntax errors, invalid inputs
  | 'voice';    // [35, 30, 35]ms gentle pulse for voice assistant start & stop

// Vibration patterns in milliseconds
const VIBRATION_PATTERNS: Record<HapticType, number | number[]> = {
  selection: 12,
  light: 18,
  medium: 35,
  heavy: 55,
  success: [25, 45, 40],
  error: [60, 40, 60],
  voice: [35, 30, 35],
};

// Web Audio synthesizer for accessible earcon feedback
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioContext) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioContext = new AudioCtxClass();
      }
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    return audioContext;
  } catch {
    return null;
  }
}

class HapticEngine {
  private enabled: boolean = true;
  private soundAssistanceEnabled: boolean = false;
  private intensity: 'soft' | 'medium' | 'strong' = 'medium';

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedEnabled = localStorage.getItem('pocketkit_haptics_enabled');
        if (savedEnabled !== null) {
          this.enabled = savedEnabled === 'true';
        }
        const savedSound = localStorage.getItem('pocketkit_haptic_sound');
        if (savedSound !== null) {
          this.soundAssistanceEnabled = savedSound === 'true';
        }
        const savedIntensity = localStorage.getItem('pocketkit_haptic_intensity') as 'soft' | 'medium' | 'strong';
        if (savedIntensity) {
          this.intensity = savedIntensity;
        }
      } catch {
        // LocalStorage fallback
      }
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (typeof window !== 'undefined') {
      localStorage.setItem('pocketkit_haptics_enabled', val ? 'true' : 'false');
    }
    if (val) {
      this.trigger('medium');
    }
  }

  public isSoundAssistanceEnabled(): boolean {
    return this.soundAssistanceEnabled;
  }

  public setSoundAssistanceEnabled(val: boolean) {
    this.soundAssistanceEnabled = val;
    if (typeof window !== 'undefined') {
      localStorage.setItem('pocketkit_haptic_sound', val ? 'true' : 'false');
    }
    if (val) {
      this.playTactileClick('light');
    }
  }

  public getIntensity(): 'soft' | 'medium' | 'strong' {
    return this.intensity;
  }

  public setIntensity(val: 'soft' | 'medium' | 'strong') {
    this.intensity = val;
    if (typeof window !== 'undefined') {
      localStorage.setItem('pocketkit_haptic_intensity', val);
    }
    this.trigger('medium');
  }

  /**
   * Main trigger function for physical and acoustic tactile feedback
   */
  public trigger(type: HapticType = 'light') {
    if (!this.enabled && !this.soundAssistanceEnabled) return;

    // 1. Check Native Android Bridge
    if (typeof window !== 'undefined') {
      const androidApp = (window as unknown as { AndroidApp?: { performHapticFeedback?: (type: string) => void } }).AndroidApp;
      if (androidApp && typeof androidApp.performHapticFeedback === 'function') {
        try {
          androidApp.performHapticFeedback(type);
        } catch {
          // Native bridge fallback
        }
      }
    }

    // 2. Physical Web Vibration API
    if (this.enabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        let pattern = VIBRATION_PATTERNS[type];
        const multiplier = this.intensity === 'soft' ? 0.7 : this.intensity === 'strong' ? 1.4 : 1.0;

        if (typeof pattern === 'number') {
          navigator.vibrate(Math.round(pattern * multiplier));
        } else if (Array.isArray(pattern)) {
          navigator.vibrate(pattern.map((d, i) => (i % 2 === 0 ? Math.round(d * multiplier) : d)));
        }
      } catch {
        // Ignore user activation or unsupported errors
      }
    }

    // 3. Audio Tactile Tick for Visually Impaired (earcon support)
    if (this.soundAssistanceEnabled) {
      this.playTactileClick(type);
    }
  }

  /**
   * Plays a subtle, non-intrusive micro-audio click
   */
  public playTactileClick(type: HapticType) {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      let freq = 1200;
      let duration = 0.02;
      let vol = 0.03;

      switch (type) {
        case 'selection':
          freq = 1400;
          duration = 0.015;
          vol = 0.02;
          break;
        case 'light':
          freq = 1100;
          duration = 0.02;
          vol = 0.035;
          break;
        case 'medium':
          freq = 850;
          duration = 0.035;
          vol = 0.05;
          break;
        case 'heavy':
          freq = 600;
          duration = 0.05;
          vol = 0.06;
          break;
        case 'success':
          freq = 1760; // High cheerful chime
          duration = 0.08;
          vol = 0.05;
          break;
        case 'error':
          freq = 280; // Low error blip
          duration = 0.06;
          vol = 0.07;
          break;
        case 'voice':
          freq = 980;
          duration = 0.04;
          vol = 0.04;
          break;
      }

      osc.type = type === 'error' ? 'sawtooth' : type === 'success' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio autoplay policy
    }
  }
}

export const haptics = new HapticEngine();

/**
 * Convenience helper to trigger tactile vibration
 */
export function triggerHaptic(type: HapticType = 'light') {
  haptics.trigger(type);
}
