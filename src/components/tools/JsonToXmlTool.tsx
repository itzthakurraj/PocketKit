import React, { useState } from 'react';
import { Copy, Check, Download, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const JsonToXmlTool: React.FC = () => {
  const [jsonText, setJsonText] = useState('{\n  "note": {\n    "to": "Team",\n    "from": "PocketKit",\n    "heading": "Release",\n    "body": "Version 2.0 is live with offline support!"\n  }\n}');
  const [xmlOutput, setXmlOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const jsonToXml = (obj: any, rootName = 'root'): string => {
    let xml = '';
    for (const prop in obj) {
      if (Array.isArray(obj[prop])) {
        for (const item of obj[prop]) {
          xml += `<${prop}>${typeof item === 'object' ? jsonToXml(item, '') : item}</${prop}>\n`;
        }
      } else if (typeof obj[prop] === 'object' && obj[prop] !== null) {
        xml += `<${prop}>\n${jsonToXml(obj[prop], '')}</${prop}>\n`;
      } else {
        xml += `<${prop}>${obj[prop]}</${prop}>\n`;
      }
    }
    return rootName ? `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n${xml}</${rootName}>` : xml;
  };

  const convert = () => {
    try {
      setError(null);
      const parsed = JSON.parse(jsonText);
      const xml = jsonToXml(parsed, '');
      setXmlOutput(`<?xml version="1.0" encoding="UTF-8"?>\n${xml}`);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON format');
    }
  };

  React.useEffect(() => {
    convert();
  }, [jsonText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(xmlOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
            Input JSON
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
            Output XML
          </label>
          {error ? (
            <div className="h-[200px] p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs font-mono">
              <span className="font-bold">Error:</span> {error}
            </div>
          ) : (
            <textarea
              readOnly
              rows={10}
              value={xmlOutput}
              className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-indigo-600 dark:text-indigo-400"
            />
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm hover:bg-indigo-700 shadow-sm cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? t('tool.copied', 'Copied!') : t('tool.copy', 'Copy XML')}</span>
        </button>
      </div>
    </div>
  );
};
