import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  Download,
  Copy,
  Check,
  RotateCcw,
  Activity,
  Sliders,
  Radio,
  Music,
} from 'lucide-react';

// Helper to write minimal WAV file from Float32Array PCM samples
function createWavBlob(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // Mono channel
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // Byte rate
  view.setUint16(32, 2, true); // Block align
  view.setUint16(34, 16, true); // Bits per sample
  writeString(36, 'data');
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

// ==========================================
// 1. FREQUENCY SPECTRUM VISUALIZER
// ==========================================
export const FrequencySpectrumVisualizerTool: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(440);
  const [type, setType] = useState<OscillatorType>('sine');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const stopAudio = () => {
    if (oscRef.current) {
      try { oscRef.current.stop(); } catch {}
      oscRef.current.disconnect();
      oscRef.current = null;
    }
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsPlaying(false);
  };

  const startAudio = () => {
    stopAudio();
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = ctx;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const analyser = ctx.createAnalyser();

    analyser.fftSize = 256;
    gain.gain.value = 0.15;
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    osc.connect(gain);
    gain.connect(analyser);
    analyser.connect(ctx.destination);

    osc.start();
    oscRef.current = osc;
    analyserRef.current = analyser;
    setIsPlaying(true);

    const render = () => {
      if (!canvasRef.current || !analyserRef.current) return;
      const canvas = canvasRef.current;
      const cCtx = canvas.getContext('2d');
      if (!cCtx) return;

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      cCtx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        cCtx.fillStyle = `rgb(99, 102, ${Math.min(255, 150 + dataArray[i])})`;
        cCtx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }
      animFrameRef.current = requestAnimationFrame(render);
    };
    render();
  };

  useEffect(() => {
    if (oscRef.current && audioCtxRef.current) {
      oscRef.current.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);
      oscRef.current.type = type;
    }
  }, [frequency, type]);

  useEffect(() => {
    return () => stopAudio();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Real-Time Frequency Spectrum Visualizer</span>
        </div>
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button onClick={stopAudio} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-rose-600 text-white rounded-lg">
              <Square className="w-3.5 h-3.5" /> Stop Audio
            </button>
          ) : (
            <button onClick={startAudio} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg">
              <Play className="w-3.5 h-3.5" /> Start Tone & Visualizer
            </button>
          )}
        </div>
      </div>

      <div className="p-4 bg-slate-900 rounded-2xl">
        <canvas ref={canvasRef} width={600} height={180} className="w-full h-44 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Frequency: <span className="font-mono text-indigo-600 font-bold">{frequency} Hz</span>
          </label>
          <input
            type="range"
            min={50}
            max={2000}
            step={5}
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Waveform</label>
          <div className="grid grid-cols-4 gap-2">
            {(['sine', 'square', 'sawtooth', 'triangle'] as OscillatorType[]).map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`py-1.5 text-xs rounded-lg capitalize border ${type === t ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. BINAURAL BEATS GENERATOR
// ==========================================
export const BinauralBeatsGeneratorTool: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [baseFreq, setBaseFreq] = useState(200);
  const [beatFreq, setBeatFreq] = useState(10); // Alpha range (10Hz)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscLRef = useRef<OscillatorNode | null>(null);
  const oscRRef = useRef<OscillatorNode | null>(null);

  const stop = () => {
    try { oscLRef.current?.stop(); } catch {}
    try { oscRRef.current?.stop(); } catch {}
    oscLRef.current = null;
    oscRRef.current = null;
    setIsPlaying(false);
  };

  const start = () => {
    stop();
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = ctx;

    const oscL = ctx.createOscillator();
    const oscR = ctx.createOscillator();
    const panL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const panR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const gain = ctx.createGain();

    gain.gain.value = 0.15;
    oscL.frequency.value = baseFreq;
    oscR.frequency.value = baseFreq + beatFreq;

    if (panL && panR) {
      panL.pan.value = -1; // Left ear
      panR.pan.value = 1;  // Right ear
      oscL.connect(panL);
      panL.connect(gain);
      oscR.connect(panR);
      panR.connect(gain);
    } else {
      oscL.connect(gain);
      oscR.connect(gain);
    }

    gain.connect(ctx.destination);
    oscL.start();
    oscR.start();

    oscLRef.current = oscL;
    oscRRef.current = oscR;
    setIsPlaying(true);
  };

  useEffect(() => {
    return () => stop();
  }, []);

  const getBeatCategory = (f: number) => {
    if (f < 4) return 'Delta (0.5 - 4 Hz) - Deep Sleep & Healing';
    if (f < 8) return 'Theta (4 - 8 Hz) - Deep Meditation & REM';
    if (f < 14) return 'Alpha (8 - 14 Hz) - Relaxation & Focus';
    if (f < 30) return 'Beta (14 - 30 Hz) - High Alertness & Logic';
    return 'Gamma (30+ Hz) - Peak Cognition';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Stereo Binaural Beats Generator</span>
        </div>
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button onClick={stop} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-rose-600 text-white rounded-lg">
              <VolumeX className="w-3.5 h-3.5" /> Stop Audio
            </button>
          ) : (
            <button onClick={start} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg">
              <Volume2 className="w-3.5 h-3.5" /> Play Binaural Beats
            </button>
          )}
        </div>
      </div>

      <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800">
        <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300">Wear Headphones for True Binaural Effect</div>
        <div className="text-xs text-indigo-700 dark:text-indigo-400 mt-1">
          Left Ear: <span className="font-mono font-bold">{baseFreq} Hz</span> | Right Ear: <span className="font-mono font-bold">{baseFreq + beatFreq} Hz</span>
        </div>
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2">
          Brainwave Target: {getBeatCategory(beatFreq)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Base Frequency: <span className="font-mono text-indigo-600">{baseFreq} Hz</span>
          </label>
          <input
            type="range"
            min={100}
            max={500}
            value={baseFreq}
            onChange={(e) => {
              setBaseFreq(Number(e.target.value));
              if (isPlaying) start();
            }}
            className="w-full accent-indigo-600"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
            Beat Difference: <span className="font-mono text-indigo-600">{beatFreq} Hz</span>
          </label>
          <input
            type="range"
            min={1}
            max={40}
            value={beatFreq}
            onChange={(e) => {
              setBeatFreq(Number(e.target.value));
              if (isPlaying) start();
            }}
            className="w-full accent-indigo-600"
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. NOISE COLOR GENERATOR (White, Pink, Brown)
// ==========================================
export const AcousticNoiseGeneratorTool: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [color, setColor] = useState<'white' | 'pink' | 'brown'>('white');
  const [volume, setVolume] = useState(0.2);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodeRef = useRef<AudioNode | null>(null);

  const stop = () => {
    if (nodeRef.current) {
      try { (nodeRef.current as any).stop?.(); } catch {}
      nodeRef.current.disconnect();
      nodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const start = () => {
    stop();
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = ctx;

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    if (color === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    } else if (color === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else {
      // Brown noise
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const gainNode = ctx.createGain();
    gainNode.gain.value = volume;

    whiteNoise.connect(gainNode);
    gainNode.connect(ctx.destination);
    whiteNoise.start();

    nodeRef.current = whiteNoise;
    setIsPlaying(true);
  };

  useEffect(() => {
    return () => stop();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Acoustic Noise Generator (White, Pink, Brown)</span>
        </div>
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button onClick={stop} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-rose-600 text-white rounded-lg">
              <VolumeX className="w-3.5 h-3.5" /> Stop Noise
            </button>
          ) : (
            <button onClick={start} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg">
              <Play className="w-3.5 h-3.5" /> Play Noise
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {(['white', 'pink', 'brown'] as const).map(c => (
          <button
            key={c}
            onClick={() => {
              setColor(c);
              if (isPlaying) {
                stop();
                setTimeout(() => start(), 50);
              }
            }}
            className={`p-4 rounded-xl border text-center transition-all ${color === c ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}
          >
            <div className="font-bold text-sm capitalize text-slate-900 dark:text-white">{c} Noise</div>
            <div className="text-[11px] text-slate-500 mt-1">
              {c === 'white' && 'Equal energy per frequency. Great for blocking sudden noises.'}
              {c === 'pink' && 'Balanced octave roll-off. Natural waterfall sensation.'}
              {c === 'brown' && 'Deep low-end rumble. Ideal for deep sleep & relaxation.'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 4. CHIPTUNE 8-BIT RETRO SOUND FX GENERATOR
// ==========================================
export const ChiptuneSfxGeneratorTool: React.FC = () => {
  const [playingSfx, setPlayingSfx] = useState<string | null>(null);

  const playSfx = (type: 'coin' | 'laser' | 'jump' | 'explosion' | 'powerup') => {
    setPlayingSfx(type);
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'coin') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'laser') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.15);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'jump') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'explosion') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(30, now + 0.4);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === 'powerup') {
      osc.type = 'triangle';
      const notes = [330, 392, 659, 523, 587, 784];
      notes.forEach((freq, i) => {
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
      });
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    }

    setTimeout(() => setPlayingSfx(null), 400);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">8-Bit Chiptune Retro SFX Generator</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { id: 'coin', name: 'Coin Pickup', icon: '🪙' },
          { id: 'laser', name: 'Laser Gun', icon: '🔫' },
          { id: 'jump', name: 'Mario Jump', icon: '⬆️' },
          { id: 'explosion', name: 'Boom Explosion', icon: '💥' },
          { id: 'powerup', name: '1-Up Powerup', icon: '🍄' },
        ].map(sfx => (
          <button
            key={sfx.id}
            onClick={() => playSfx(sfx.id as any)}
            className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${playingSfx === sfx.id ? 'bg-indigo-600 text-white scale-95' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400'}`}
          >
            <span className="text-2xl">{sfx.icon}</span>
            <span className="text-xs font-bold">{sfx.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 5. DTMF TELEPHONE KEYPAD TONES
// ==========================================
export const DtmfToneGeneratorTool: React.FC = () => {
  const DTMF_KEYS = [
    ['1', '2', '3', 'A'],
    ['4', '5', '6', 'B'],
    ['7', '8', '9', 'C'],
    ['*', '0', '#', 'D'],
  ];

  const FREQ_ROW = [697, 770, 852, 941];
  const FREQ_COL = [1209, 1336, 1477, 1633];

  const playDtmf = (rowIndex: number, colIndex: number) => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.frequency.value = FREQ_ROW[rowIndex];
    osc2.frequency.value = FREQ_COL[colIndex];
    gain.gain.value = 0.15;

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    setTimeout(() => {
      osc1.stop();
      osc2.stop();
    }, 180);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">DTMF Dual-Tone Telephone Keypad</span>
        </div>
      </div>

      <div className="max-w-xs mx-auto grid grid-cols-4 gap-2.5 p-4 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
        {DTMF_KEYS.map((row, r) =>
          row.map((digit, c) => (
            <button
              key={digit}
              onClick={() => playDtmf(r, c)}
              className="h-14 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center font-bold text-lg shadow-sm hover:bg-indigo-50 dark:hover:bg-slate-800 active:scale-95 transition-all"
            >
              <span className="text-slate-900 dark:text-white">{digit}</span>
              <span className="text-[9px] text-slate-400 font-mono font-normal">
                {FREQ_ROW[r]}/{FREQ_COL[c]}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

// ==========================================
// 6. TAP TEMPO BPM COUNTER
// ==========================================
export const TapTempoBpmTool: React.FC = () => {
  const [bpm, setBpm] = useState<number | null>(null);
  const [taps, setTaps] = useState<number[]>([]);

  const handleTap = () => {
    const now = performance.now();
    const recent = taps.filter(t => now - t < 3000);
    const updated = [...recent, now];
    setTaps(updated);

    if (updated.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < updated.length; i++) {
        intervals.push(updated[i] - updated[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      setBpm(calculatedBpm);
    }
  };

  const reset = () => {
    setTaps([]);
    setBpm(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Tap Tempo BPM Counter</span>
        </div>
        <button onClick={reset} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg">
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
        <div className="text-6xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
          {bpm ? bpm : '--'} <span className="text-sm font-sans font-normal text-slate-400">BPM</span>
        </div>
        <button
          onClick={handleTap}
          className="w-48 h-20 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-lg shadow-lg shadow-indigo-500/20 transition-all"
        >
          TAP HERE
        </button>
        <span className="text-xs text-slate-500">Tap along with the beat (or press Spacebar)</span>
      </div>
    </div>
  );
};

// ==========================================
// 7. AMBIENT SOUNDBOARD MIXER
// ==========================================
export const AmbientSoundboardTool: React.FC = () => {
  const [tracks, setTracks] = useState({
    rain: 0,
    waves: 0,
    wind: 0,
    space: 0,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Ambient Procedural Soundboard</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { key: 'rain', name: 'Gentle Rain', desc: 'Rhythmic soft drizzle on window' },
          { key: 'waves', name: 'Ocean Surf', desc: 'Crashing deep sea swells' },
          { key: 'wind', name: 'Mountain Breeze', desc: 'Whistling pine tree gusts' },
          { key: 'space', name: 'Cosmic Drone', desc: 'Sub-bass celestial drone' },
        ].map(item => (
          <div key={item.key} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{item.name}</span>
              <span className="text-xs font-mono text-indigo-600 font-bold">{(tracks as any)[item.key]}%</span>
            </div>
            <p className="text-[11px] text-slate-500">{item.desc}</p>
            <input
              type="range"
              min={0}
              max={100}
              value={(tracks as any)[item.key]}
              onChange={(e) => setTracks(prev => ({ ...prev, [item.key]: Number(e.target.value) }))}
              className="w-full accent-indigo-600"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 8. MUSICAL CHORD & SCALE FINDER
// ==========================================
export const ChordScaleFinderTool: React.FC = () => {
  const [root, setRoot] = useState('C');
  const [scaleType, setScaleType] = useState('Major');

  const SCALES: Record<string, number[]> = {
    Major: [0, 2, 4, 5, 7, 9, 11],
    Minor: [0, 2, 3, 5, 7, 8, 10],
    Dorian: [0, 2, 3, 5, 7, 9, 10],
    Mixolydian: [0, 2, 4, 5, 7, 9, 10],
    Pentatonic: [0, 2, 4, 7, 9],
    Blues: [0, 3, 5, 6, 7, 10],
  };

  const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const scaleNotes = useMemo(() => {
    const rootIdx = NOTES.indexOf(root);
    const intervals = SCALES[scaleType] || SCALES.Major;
    return intervals.map(semitone => NOTES[(rootIdx + semitone) % 12]);
  }, [root, scaleType]);

  const playScale = () => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const baseFreqs: Record<string, number> = {
      C: 261.63, 'C#': 277.18, D: 293.66, 'D#': 311.13, E: 329.63,
      F: 349.23, 'F#': 369.99, G: 392.00, 'G#': 415.30, A: 440.00,
      'A#': 466.16, B: 493.88
    };

    scaleNotes.forEach((note: string, idx: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteFreq = (baseFreqs[note] || 440) * (idx > 4 ? 2 : 1);

      osc.frequency.value = noteFreq;
      gain.gain.value = 0.15;

      osc.connect(gain);
      gain.connect(ctx.destination);

      const start = ctx.currentTime + idx * 0.25;
      osc.start(start);
      osc.stop(start + 0.22);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Musical Chord & Scale Theory Finder</span>
        </div>
        <button onClick={playScale} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
          <Play className="w-3.5 h-3.5" /> Play Scale Audio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Root Key</label>
          <div className="grid grid-cols-6 gap-1.5">
            {NOTES.map(n => (
              <button
                key={n}
                onClick={() => setRoot(n)}
                className={`py-1.5 text-xs font-mono font-bold rounded-lg border ${root === n ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Scale Type</label>
          <div className="grid grid-cols-3 gap-1.5">
            {Object.keys(SCALES).map(s => (
              <button
                key={s}
                onClick={() => setScaleType(s)}
                className={`py-1.5 text-xs rounded-lg border ${scaleType === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Scale Notes: {root} {scaleType}
        </div>
        <div className="flex flex-wrap gap-2">
          {scaleNotes.map((n: string, i: number) => (
            <div key={i} className="px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 font-mono font-bold text-indigo-700 dark:text-indigo-300">
              {n}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
