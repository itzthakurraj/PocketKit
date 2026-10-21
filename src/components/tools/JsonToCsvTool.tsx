import React, { useState } from 'react';
import { Copy, Check, Download, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const JsonToCsvTool: React.FC = () => {
  const [jsonText, setJsonText] = useState('[\n  {"id": 1, "name": "Calculator", "category": "math"},\n  {"id": 2, "name": "Compressor", "category": "image"},\n  {"id": 3, "name": "Beautifier", "category": "dev"}\n]');
  const [csvOutput, setCsvOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const convert = () => {
    try {
      setError(null);
      const parsed = JSON.parse(jsonText);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      if (items.length === 0) {
        setCsvOutput('');
        return;
      }
      const headers = Object.keys(items[0]);
      const csvRows = [headers.join(',')];

      for (const row of items) {
        const values = headers.map((header) => {
          const val = row[header];
          const escaped = ('' + (val !== undefined ? val : '')).replace(/"/g, '""');
          return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
      }
      setCsvOutput(csvRows.join('\n'));
    } catch (err: any) {
      setError(err.message || 'Invalid JSON format');
    }
  };

  React.useEffect(() => {
    convert();
  }, [jsonText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(csvOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'pocketkit_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
            Input JSON Array
          </label>
          <textarea
            rows={10}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
            Output CSV Data
          </label>
          {error ? (
            <div className="h-[200px] p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs font-mono">
              <span className="font-bold">Error:</span> {error}
            </div>
          ) : (
            <textarea
              readOnly
              rows={10}
              value={csvOutput}
              className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200"
            />
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm hover:bg-slate-200 cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? t('tool.copied', 'Copied!') : t('tool.copy', 'Copy CSV')}</span>
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm hover:bg-indigo-700 shadow-sm cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{t('tool.download', 'Download .CSV')}</span>
        </button>
      </div>
    </div>
  );
};
