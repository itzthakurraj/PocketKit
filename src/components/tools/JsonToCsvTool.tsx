import React, { useState } from 'react';
import { ArrowLeftRight, Download, Copy, Check, Table, AlertCircle } from 'lucide-react';

const SAMPLE_JSON = `[
  { "id": 1, "name": "Alice Johnson", "role": "Frontend Engineer", "location": "San Francisco" },
  { "id": 2, "name": "Bob Smith", "role": "Full Stack Dev", "location": "Austin" },
  { "id": 3, "name": "Charlie Brown", "role": "Product Designer", "location": "New York" }
]`;

export const JsonToCsvTool: React.FC = () => {
  const [mode, setMode] = useState<'jsonToCsv' | 'csvToJson'>('jsonToCsv');
  const [input, setInput] = useState(SAMPLE_JSON);
  const [delimiter, setDelimiter] = useState(',');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [previewRows, setPreviewRows] = useState<string[][]>([]);

  const handleConvert = () => {
    setError(null);
    if (!input.trim()) {
      setOutput('');
      setPreviewRows([]);
      return;
    }

    try {
      if (mode === 'jsonToCsv') {
        const parsed = JSON.parse(input);
        const array = Array.isArray(parsed) ? parsed : [parsed];
        if (array.length === 0) {
          setOutput('');
          setPreviewRows([]);
          return;
        }

        const headers = Array.from(
          new Set(array.flatMap((item) => (typeof item === 'object' && item !== null ? Object.keys(item) : [])))
        );

        const rows = array.map((item) =>
          headers.map((h) => {
            const val = item[h] !== undefined ? String(item[h]) : '';
            return val.includes(delimiter) || val.includes('"') || val.includes('\n')
              ? `"${val.replace(/"/g, '""')}"`
              : val;
          })
        );

        const csvContent = [headers.join(delimiter), ...rows.map((r) => r.join(delimiter))].join('\n');
        setOutput(csvContent);
        setPreviewRows([headers, ...rows]);
      } else {
        // CSV to JSON
        const lines = input.trim().split(/\r?\n/).filter(Boolean);
        if (lines.length < 2) {
          throw new Error('CSV requires at least a header row and one data row');
        }

        const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^"|"$/g, ''));
        const data = lines.slice(1).map((line) => {
          const cells = line.split(delimiter).map((c) => c.trim().replace(/^"|"$/g, ''));
          const rowObj: Record<string, string> = {};
          headers.forEach((h, idx) => {
            rowObj[h] = cells[idx] ?? '';
          });
          return rowObj;
        });

        const jsonStr = JSON.stringify(data, null, 2);
        setOutput(jsonStr);
        setPreviewRows([headers, ...data.map((d) => headers.map((h) => d[h]))]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = mode === 'jsonToCsv' ? 'csv' : 'json';
    const mime = mode === 'jsonToCsv' ? 'text/csv' : 'application/json';
    const blob = new Blob([output], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const newMode = mode === 'jsonToCsv' ? 'csvToJson' : 'jsonToCsv';
              setMode(newMode);
              setInput(output || input);
              setOutput('');
              setPreviewRows([]);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
          >
            <span>{mode === 'jsonToCsv' ? 'JSON ➔ CSV' : 'CSV ➔ JSON'}</span>
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Delimiter:</span>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              className="text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1.5 focus:outline-none"
            >
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
              <option value="&#9;">Tab (\t)</option>
            </select>
          </div>

          <button
            onClick={handleConvert}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
          >
            Convert Now
          </button>
        </div>

        <div className="flex items-center gap-2">
          {output && (
            <>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 dark:bg-slate-700 text-white"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Editor grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            {mode === 'jsonToCsv' ? 'Input JSON Array' : 'Input CSV String'}
          </label>
          <textarea
            rows={9}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder={mode === 'jsonToCsv' ? 'Paste JSON array here...' : 'Paste CSV rows here...'}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            {mode === 'jsonToCsv' ? 'Converted CSV Output' : 'Converted JSON Output'}
          </label>
          <textarea
            rows={9}
            readOnly
            value={output}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 font-mono text-xs"
            placeholder="Converted output will appear here..."
          />
        </div>
      </div>

      {/* Live Table Preview */}
      {previewRows.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Table className="w-4 h-4 text-indigo-500" />
            <span>Table Preview ({previewRows.length - 1} rows)</span>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 max-h-60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  {previewRows[0].map((header, idx) => (
                    <th key={idx} className="p-2.5 font-bold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                {previewRows.slice(1).map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-2.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
