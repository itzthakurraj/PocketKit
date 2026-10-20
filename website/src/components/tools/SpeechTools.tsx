import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Square, Copy, Check, Trash2, AlertCircle } from 'lucide-react';

export const SpeechTools: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'stt' | 'tts'>('stt');

  // Speech to Text state
  const [isListening, setIsListening] = useState(false);
  const [sttTranscript, setSttTranscript] = useState('');
  const [recognitionSupported, setRecognitionSupported] = useState(true);

  // Text to Speech state
  const [ttsText, setTtsText] = useState(
    'Welcome to Toolkit! All our online tools are completely free, private, and execute right in your browser.'
  );
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check speech recognition
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      const rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onresult = (event: any) => {
        let current = '';
        for (let i = 0; i < event.results.length; i++) {
          current += event.results[i][0].transcript + ' ';
        }
        setSttTranscript(current);
      };

      rec.onerror = () => {
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    } else {
      setRecognitionSupported(false);
    }

    // Load TTS voices
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const vList = window.speechSynthesis.getVoices();
        setVoices(vList);
        if (vList.length > 0 && !selectedVoice) {
          setSelectedVoice(vList[0].name);
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window) || !ttsText.trim()) return;
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(ttsText);
    const chosen = voices.find((v) => v.name === selectedVoice);
    if (chosen) utter.voice = chosen;
    utter.rate = rate;
    utter.pitch = pitch;

    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utter);
  };

  const handleStopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Toggle between STT and TTS */}
      <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden text-xs font-bold p-1 bg-slate-50 dark:bg-slate-800/60 max-w-sm">
        <button
          onClick={() => setActiveMode('stt')}
          className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeMode === 'stt'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          Speech to Text
        </button>
        <button
          onClick={() => setActiveMode('tts')}
          className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeMode === 'tts'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          Text to Speech
        </button>
      </div>

      {activeMode === 'stt' ? (
        <div className="space-y-4">
          {!recognitionSupported && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                Web Speech Recognition API is supported in Chromium browsers (Chrome, Edge). If unavailable, try opening in Chrome.
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <button
              onClick={toggleListening}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isListening ? 'Stop Listening' : 'Start Microphone Dictation'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSttTranscript('')}
                className="p-2 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                title="Clear transcript"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleCopy(sttTranscript)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 dark:bg-slate-700 text-white"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <textarea
            rows={10}
            value={sttTranscript}
            onChange={(e) => setSttTranscript(e.target.value)}
            placeholder="Click 'Start Microphone Dictation' and begin speaking, or paste text to edit here..."
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">
                Select Voice
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 truncate"
              >
                {voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">
                <span>Speed Rate</span>
                <span>{rate}x</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.1}
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">
                <span>Pitch</span>
                <span>{pitch}</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={1.5}
                step={0.1}
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>

          <textarea
            rows={8}
            value={ttsText}
            onChange={(e) => setTtsText(e.target.value)}
            placeholder="Type text for speech synthesis..."
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          <div className="flex items-center gap-3">
            <button
              onClick={handleSpeak}
              disabled={isSpeaking}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-xs transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              Play Speech
            </button>
            {isSpeaking && (
              <button
                onClick={handleStopSpeaking}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
              >
                <Square className="w-4 h-4" />
                Stop
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
