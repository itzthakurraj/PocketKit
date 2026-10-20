import React, { useState } from 'react';
import { ArrowLeftRight, Copy, Check, Download, AlertCircle } from 'lucide-react';

const SAMPLE_JSON = `{
  "book": {
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "year": 2008,
    "rating": 4.8
  }
}`;

export const JsonToXmlTool: React.FC = () => {
  const [mode, setMode] = useState<'jsonToXml' | 'xmlToJson'>('jsonToXml');
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Helper to serialize object to XML
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonToXmlStr = (obj: any, indent = 0): string => {
    const spaces = ' '.repeat(indent);
    let xml = '';
    for (const prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        const val = obj[prop];
        if (Array.isArray(val)) {
          val.forEach((item) => {
            if (typeof item === 'object' && item !== null) {
              xml += `${spaces}<${prop}>\n${jsonToXmlStr(item, indent + 2)}${spaces}</${prop}>\n`;
            } else {
              xml += `${spaces}<${prop}>${item}</${prop}>\n`;
            }
          });
        } else if (typeof val === 'object' && val !== null) {
          xml += `${spaces}<${prop}>\n${jsonToXmlStr(val, indent + 2)}${spaces}</${prop}>\n`;
        } else {
          xml += `${spaces}<${prop}>${val}</${prop}>\n`;
        }
      }
    }
    return xml;
  };

  // Helper to parse XML to object
  const xmlToJsonObj = (xml: Element): any => {
    const obj: Record<string, any> = {};
    if (xml.children.length === 0) {
      return xml.textContent || '';
    }
    for (let i = 0; i < xml.children.length; i++) {
      const child = xml.children[i];
      const nodeName = child.nodeName;
      const childVal = xmlToJsonObj(child);
      if (obj[nodeName]) {
        if (!Array.isArray(obj[nodeName])) {
          obj[nodeName] = [obj[nodeName]];
        }
        obj[nodeName].push(childVal);
      } else {
        obj[nodeName] = childVal;
      }
    }
    return obj;
  };

  const handleConvert = () => {
    setError(null);
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'jsonToXml') {
        const parsed = JSON.parse(input);
        const xmlBody = jsonToXmlStr(parsed, 2);
        const completeXml = `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n${xmlBody}</root>`;
        setOutput(completeXml);
      } else {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(input, 'text/xml');
        const parseError = xmlDoc.getElementsByTagName('parsererror');
        if (parseError.length > 0) {
          throw new Error('Invalid XML structure: ' + parseError[0].textContent);
        }
        const jsonResult = xmlToJsonObj(xmlDoc.documentElement);
        setOutput(JSON.stringify(jsonResult, null, 2));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Conversion error');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = mode === 'jsonToXml' ? 'xml' : 'json';
    const mime = mode === 'jsonToXml' ? 'application/xml' : 'application/json';
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
              const newMode = mode === 'jsonToXml' ? 'xmlToJson' : 'jsonToXml';
              setMode(newMode);
              setInput(output || input);
              setOutput('');
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
          >
            <span>{mode === 'jsonToXml' ? 'JSON ➔ XML' : 'XML ➔ JSON'}</span>
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>

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
            {mode === 'jsonToXml' ? 'JSON Input' : 'XML Input'}
          </label>
          <textarea
            rows={11}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder={mode === 'jsonToXml' ? 'Paste JSON here...' : 'Paste XML tags here...'}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            {mode === 'jsonToXml' ? 'Formatted XML Output' : 'Formatted JSON Output'}
          </label>
          <textarea
            rows={11}
            readOnly
            value={output}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 font-mono text-xs"
            placeholder="Converted output will appear here..."
          />
        </div>
      </div>
    </div>
  );
};
