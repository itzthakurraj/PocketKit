import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Radio, RefreshCw, Sparkles, Clock, Sliders } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

// ================= 1. TONE & FREQUENCY GENERATOR =================
export const ToneGeneratorTool: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(440);
  const [waveType, setWaveType] = useState<OscillatorType>('sine');
  const [volume, setVolume] = useState(0.2);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const startTone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = waveType;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(volume, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;

      setIsPlaying(true);
      triggerHaptic('medium');
    } catch (e) {
      console.error(e);
    }
  };

  const stopTone = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch {}
      oscRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
    triggerHaptic('light');
  };

  useEffect(() => {
    if (oscRef.current && audioCtxRef.current) {
      oscRef.current.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);
      oscRef.current.type = waveType;
    }
  }, [frequency, waveType]);

  useEffect(() => {
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopTone();
    };
  }, []);

  const presets = [
    { label: '440 Hz (Concert A)', freq: 440 },
    { label: '528 Hz (Solfeggio)', freq: 528 },
    { label: '432 Hz (Verdi A)', freq: 432 },
    { label: '1000 Hz (Test Tone)', freq: 1000 },
    { label: '60 Hz (Mains Hum)', freq: 60 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div className="text-center sm:text-left space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">
            Output Frequency
          </span>
          <div className="text-4xl sm:text-5xl font-mono font-extrabold text-slate-900 dark:text-white tabular-nums">
            {frequency} <span className="text-xl font-normal text-slate-500">Hz</span>
          </div>
        </div>

        <button
          onClick={isPlaying ? stopTone : startTone}
          className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold shadow-md cursor-pointer transition-all ${
            isPlaying
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105'
          }`}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          <span>{isPlaying ? 'Stop Audio' : 'Play Tone'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
            <span>Frequency Slider (20 Hz - 5,000 Hz)</span>
            <span className="font-mono">{frequency} Hz</span>
          </div>
          <input
            type="range"
            min={20}
            max={5000}
            step={1}
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
            <span>Output Volume</span>
            <span className="font-mono">{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={0.8}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Waveform selection */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Waveform Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['sine', 'square', 'triangle', 'sawtooth'] as OscillatorType[]).map((w) => (
            <button
              key={w}
              onClick={() => {
                setWaveType(w);
                triggerHaptic('selection');
              }}
              className={`py-2 px-3 rounded-xl border text-xs font-bold capitalize cursor-pointer transition-all ${
                waveType === w
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Presets */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Common Harmonic Presets</label>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.freq}
              onClick={() => {
                setFrequency(p.freq);
                triggerHaptic('light');
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-indigo-500 cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ================= 2. BPM METRONOME & RHYTHM CLICKER =================
export const MetronomeTool: React.FC = () => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [currentBeat, setCurrentBeat] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const beatRef = useRef(0);
  const lastTapRef = useRef<number[]>([]);

  const playClick = (isAccent: boolean) => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.setValueAtTime(isAccent ? 1200 : 800, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.error(e);
    }
  };

  const startMetronome = () => {
    setIsPlaying(true);
    triggerHaptic('medium');
    beatRef.current = 0;
    setCurrentBeat(0);

    const intervalMs = (60 / bpm) * 1000;
    playClick(true);

    timerRef.current = window.setInterval(() => {
      beatRef.current = (beatRef.current + 1) % beatsPerBar;
      setCurrentBeat(beatRef.current);
      playClick(beatRef.current === 0);
    }, intervalMs);
  };

  const stopMetronome = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
    triggerHaptic('light');
  };

  useEffect(() => {
    if (isPlaying) {
      stopMetronome();
      startMetronome();
    }
  }, [bpm, beatsPerBar]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleTapTempo = () => {
    triggerHaptic('light');
    const now = Date.now();
    const taps = [...lastTapRef.current, now].slice(-4);
    lastTapRef.current = taps;

    if (taps.length >= 2) {
      const deltas = [];
      for (let i = 1; i < taps.length; i++) {
        deltas.push(taps[i] - taps[i - 1]);
      }
      const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
      const calculatedBpm = Math.min(260, Math.max(30, Math.round(60000 / avgDelta)));
      setBpm(calculatedBpm);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center space-y-4">
        <div className="flex justify-center gap-2">
          {Array.from({ length: beatsPerBar }).map((_, idx) => (
            <div
              key={idx}
              className={`w-6 h-6 rounded-full transition-all ${
                isPlaying && currentBeat === idx
                  ? idx === 0
                    ? 'bg-amber-500 scale-125 shadow-md shadow-amber-500/50'
                    : 'bg-indigo-600 scale-110 shadow-md shadow-indigo-600/50'
                  : 'bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Current Tempo
          </span>
          <div className="text-5xl sm:text-6xl font-mono font-black text-slate-900 dark:text-white tabular-nums">
            {bpm} <span className="text-xl font-normal text-slate-500">BPM</span>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={isPlaying ? stopMetronome : startMetronome}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white shadow-md cursor-pointer transition-all ${
              isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isPlaying ? 'Stop' : 'Start Metronome'}</span>
          </button>

          <button
            onClick={handleTapTempo}
            className="px-5 py-3.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-slate-100 cursor-pointer transition-colors"
          >
            Tap Tempo
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Tempo Range (30 - 260 BPM)</span>
          <span className="font-mono">{bpm} BPM</span>
        </div>
        <input
          type="range"
          min={30}
          max={260}
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Time Signature</label>
        <div className="grid grid-cols-4 gap-2">
          {[2, 3, 4, 6].map((beats) => (
            <button
              key={beats}
              onClick={() => {
                setBeatsPerBar(beats);
                triggerHaptic('selection');
              }}
              className={`py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                beatsPerBar === beats
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {beats}/4
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ================= 3. WHITE, PINK & BROWN NOISE MACHINE =================
export const NoiseGeneratorTool: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [noiseType, setNoiseType] = useState<'white' | 'pink' | 'brown'>('white');
  const [volume, setVolume] = useState(0.2);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const startNoise = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      if (noiseType === 'white') {
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
      } else if (noiseType === 'pink') {
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
          b6 = white * 0.115926;
        }
      } else {
        // Brown noise
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        }
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume, ctx.currentTime);

      noiseSource.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start();
      sourceNodeRef.current = noiseSource;
      gainNodeRef.current = gain;

      setIsPlaying(true);
      triggerHaptic('medium');
    } catch (e) {
      console.error(e);
    }
  };

  const stopNoise = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch {}
      sourceNodeRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
    triggerHaptic('light');
  };

  useEffect(() => {
    if (isPlaying) {
      stopNoise();
      startNoise();
    }
  }, [noiseType]);

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopNoise();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-bold">
            Ambient Sound Masking
          </span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">
            {noiseType} Noise Active
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            Continuous soothing sound to block distractions, enhance focus, or aid sleep.
          </p>
        </div>

        <button
          onClick={isPlaying ? stopNoise : startNoise}
          className={`px-8 py-4 rounded-xl font-bold text-white shadow-md flex items-center gap-2 cursor-pointer transition-all ${
            isPlaying ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          <span>{isPlaying ? 'Stop Noise' : 'Play Noise'}</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { type: 'white', title: 'White Noise', desc: 'Equal energy across all frequencies' },
          { type: 'pink', title: 'Pink Noise', desc: 'Deeper, balanced soothing rainfall tone' },
          { type: 'brown', title: 'Brown Noise', desc: 'Deep warm rumble, waterfall tone' },
        ].map((item) => (
          <button
            key={item.type}
            onClick={() => {
              setNoiseType(item.type as any);
              triggerHaptic('selection');
            }}
            className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
              noiseType === item.type
                ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200'
            }`}
          >
            <div className="font-bold text-sm">{item.title}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.desc}</div>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Master Volume</span>
          <span className="font-mono">{Math.round(volume * 100)}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={0.6}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer"
        />
      </div>
    </div>
  );
};
