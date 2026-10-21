import React, { useState } from 'react';
import { Copy, Check, Sparkles, Volume2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit',
  'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat',
  'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
  'mollit', 'anim', 'id', 'est', 'laborum'
];

export const LoremGeneratorTool: React.FC = () => {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const { t, speak, isSpeaking, stopSpeaking } = useLanguage();

  const generate = () => {
    let result = '';
    if (type === 'words') {
      const words: string[] = [];
      for (let i = 0; i < count; i++) {
        words.push(LOREM_WORDS[i % LOREM_WORDS.length]);
      }
      result = words.join(' ') + '.';
    } else if (type === 'sentences') {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        const sentenceLen = 8 + (i % 7);
        const words: string[] = [];
        for (let j = 0; j < sentenceLen; j++) {
          words.push(LOREM_WORDS[(i * 5 + j) % LOREM_WORDS.length]);
        }
        const s = words.join(' ');
        sentences.push(s.charAt(0).toUpperCase() + s.slice(1) + '.');
      }
      result = sentences.join(' ');
    } else {
      const paras: string[] = [];
      for (let p = 0; p < count; p++) {
        const sentences: string[] = [];
        for (let i = 0; i < 4; i++) {
          const sentenceLen = 9 + (i % 6);
          const words: string[] = [];
          for (let j = 0; j < sentenceLen; j++) {
            words.push(LOREM_WORDS[(p * 10 + i * 5 + j) % LOREM_WORDS.length]);
          }
          const s = words.join(' ');
          sentences.push(s.charAt(0).toUpperCase() + s.slice(1) + '.');
        }
        paras.push(sentences.join(' '));
      }
      result = paras.join('\n\n');
    }
    setOutput(result);
  };

  React.useEffect(() => {
    generate();
  }, [count, type]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Generate:</label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
            className="w-16 px-2 py-1 text-center font-bold text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
        <div className="flex rounded-lg border border-slate-300 dark:border-slate-600 overflow-hidden">
          {(['paragraphs', 'sentences', 'words'] as const).map((tMode) => (
            <button
              key={tMode}
              onClick={() => setType(tMode)}
              className={`px-3 py-1 text-xs font-bold capitalize transition-colors cursor-pointer ${
                type === tMode
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tMode}
            </button>
          ))}
        </div>
        <button
          onClick={generate}
          className="ml-auto px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          {t('tool.generate', 'Regenerate')}
        </button>
      </div>

      <textarea
        rows={8}
        readOnly
        value={output}
        className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm leading-relaxed"
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">
          {output.length} {t('character.chars', 'Characters')}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm hover:bg-indigo-700 shadow-sm cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? t('tool.copied', 'Copied!') : t('tool.copy', 'Copy Lorem')}</span>
        </button>
      </div>
    </div>
  );
};
