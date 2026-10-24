import React, { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  FileCode,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Hash,
  Terminal,
  Code2,
  Layers,
  ArrowRightLeft,
  KeyRound,
  Eye,
  Search,
} from 'lucide-react';

// ==========================================
// 1. JSON SCHEMA VALIDATOR
// ==========================================
export const JsonSchemaValidatorTool: React.FC = () => {
  const [jsonData, setJsonData] = useState<string>(
    JSON.stringify({ id: 101, username: "alex_coder", email: "alex@example.com", isActive: true, roles: ["admin", "developer"] }, null, 2)
  );
  const [schemaData, setSchemaData] = useState<string>(
    JSON.stringify({
      type: "object",
      properties: {
        id: { type: "number" },
        username: { type: "string", minLength: 3 },
        email: { type: "string" },
        isActive: { type: "boolean" },
        roles: { type: "array" }
      },
      required: ["id", "username", "email"]
    }, null, 2)
  );
  const [copied, setCopied] = useState(false);

  const validationResult = useMemo(() => {
    try {
      const parsedData = JSON.parse(jsonData);
      const parsedSchema = JSON.parse(schemaData);

      const errors: string[] = [];
      if (parsedSchema.type && typeof parsedData !== parsedSchema.type && !(parsedSchema.type === 'array' && Array.isArray(parsedData))) {
        errors.push(`Expected root type '${parsedSchema.type}', but received '${Array.isArray(parsedData) ? 'array' : typeof parsedData}'`);
      }

      if (parsedSchema.required && Array.isArray(parsedSchema.required)) {
        for (const req of parsedSchema.required) {
          if (parsedData[req] === undefined) {
            errors.push(`Missing required field: '${req}'`);
          }
        }
      }

      if (parsedSchema.properties && typeof parsedData === 'object' && parsedData !== null) {
        for (const [key, rules] of Object.entries<any>(parsedSchema.properties)) {
          if (parsedData[key] !== undefined) {
            const actualType = Array.isArray(parsedData[key]) ? 'array' : typeof parsedData[key];
            if (rules.type && actualType !== rules.type) {
              errors.push(`Property '${key}' should be of type '${rules.type}', got '${actualType}'`);
            }
            if (rules.minLength && typeof parsedData[key] === 'string' && parsedData[key].length < rules.minLength) {
              errors.push(`Property '${key}' length (${parsedData[key].length}) is less than minLength (${rules.minLength})`);
            }
          }
        }
      }

      return {
        valid: errors.length === 0,
        errors,
        parsedData,
      };
    } catch (err: any) {
      return {
        valid: false,
        errors: [`JSON Syntax Error: ${err.message}`],
        parsedData: null,
      };
    }
  }, [jsonData, schemaData]);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(validationResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'validated-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">JSON Schema Validator</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setJsonData(JSON.stringify({ id: 202, username: "sam", email: "sam@domain.org", isActive: false, roles: ["tester"] }, null, 2));
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Load Sample
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Target JSON Data</label>
          <textarea
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            rows={10}
            className="w-full p-3 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">JSON Schema (RFC/Draft)</label>
          <textarea
            value={schemaData}
            onChange={(e) => setSchemaData(e.target.value)}
            rows={10}
            className="w-full p-3 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className={`p-4 rounded-xl border ${validationResult.valid ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'}`}>
        <div className="flex items-center gap-2 mb-2">
          {validationResult.valid ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-emerald-900 dark:text-emerald-300">Schema Validation Passed</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <span className="font-semibold text-rose-900 dark:text-rose-300">Validation Errors ({validationResult.errors.length})</span>
            </>
          )}
        </div>
        {validationResult.errors.length > 0 && (
          <ul className="list-disc list-inside text-xs font-mono space-y-1 text-rose-800 dark:text-rose-300">
            {validationResult.errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. GRAPHQL FORMATTER & MINIFIER
// ==========================================
export const GraphqlFormatterTool: React.FC = () => {
  const [query, setQuery] = useState<string>(
    `query GetUserProfile($userId: ID!) { user(id: $userId) { id name email avatar posts(limit: 5) { id title createdAt commentsCount } settings { theme notificationsEnabled } } }`
  );
  const [mode, setMode] = useState<'pretty' | 'minify'>('pretty');
  const [copied, setCopied] = useState(false);

  const formatted = useMemo(() => {
    if (!query.trim()) return '';
    if (mode === 'minify') {
      return query
        .replace(/#.*$/gm, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*([\{\}\(\):,=])\s*/g, '$1')
        .trim();
    }
    // Pretty print indentation
    let indent = 0;
    const tokens = query.replace(/\s+/g, ' ').split(/([\{\}])/g);
    let result = '';
    for (const t of tokens) {
      const token = t.trim();
      if (!token) continue;
      if (token === '}') {
        indent = Math.max(0, indent - 1);
        result += '\n' + '  '.repeat(indent) + '}';
      } else if (token === '{') {
        result += ' {\n';
        indent++;
      } else {
        const lines = token.split(/(?<=[a-zA-Z0-9_\)])\s+(?=[a-zA-Z_])/g);
        for (const line of lines) {
          if (line.trim()) {
            result += '  '.repeat(indent) + line.trim() + '\n';
          }
        }
      }
    }
    return result.trim();
  }, [query, mode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([formatted], { type: 'application/graphql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `query.${mode === 'minify' ? 'min.' : ''}graphql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">GraphQL Formatter & Minifier</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode(m => m === 'pretty' ? 'minify' : 'pretty')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-200 dark:bg-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
          >
            Mode: {mode === 'pretty' ? 'Beautify' : 'Minify'}
          </button>
          <button
            onClick={() => setQuery(`mutation CreateComment($postId: ID!, $content: String!) {\n  addComment(input: { postId: $postId, content: $content }) {\n    comment {\n      id\n      content\n      author { name }\n    }\n  }\n}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Sample
          </button>
          <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 dark:border-slate-700">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Raw GraphQL</label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={12}
            className="w-full p-3 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Formatted GraphQL Output</label>
          <textarea
            readOnly
            value={formatted}
            rows={12}
            className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. HTTP HEADERS INSPECTOR & ANALYZER
// ==========================================
export const HttpHeadersInspectorTool: React.FC = () => {
  const [rawHeaders, setRawHeaders] = useState<string>(
    `HTTP/2 200 OK
date: Sun, 24 Oct 2026 12:00:00 GMT
content-type: application/json; charset=utf-8
content-encoding: gzip
strict-transport-security: max-age=63072000; includeSubDomains; preload
content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline'
x-frame-options: DENY
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin
cache-control: public, max-age=3600, s-maxage=86400
access-control-allow-origin: *`
  );
  const [copied, setCopied] = useState(false);

  const parsed = useMemo(() => {
    const lines = rawHeaders.split('\n').map(l => l.trim()).filter(Boolean);
    const headers: { name: string; value: string; isSecurity: boolean; status: string }[] = [];
    const secHeaders = ['strict-transport-security', 'content-security-policy', 'x-frame-options', 'x-content-type-options', 'referrer-policy', 'permissions-policy'];

    for (const line of lines) {
      if (line.toUpperCase().startsWith('HTTP/')) continue;
      const idx = line.indexOf(':');
      if (idx !== -1) {
        const name = line.substring(0, idx).trim();
        const value = line.substring(idx + 1).trim();
        const isSec = secHeaders.includes(name.toLowerCase());
        headers.push({
          name,
          value,
          isSecurity: isSec,
          status: isSec ? 'Secured' : 'Standard',
        });
      }
    }
    return headers;
  }, [rawHeaders]);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(parsed, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">HTTP Response Headers Inspector</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            Copy JSON
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Paste Raw Headers</label>
          <textarea
            value={rawHeaders}
            onChange={(e) => setRawHeaders(e.target.value)}
            rows={10}
            className="w-full p-3 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 p-2">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="p-2">Header</th>
                <th className="p-2">Value</th>
                <th className="p-2">Tag</th>
              </tr>
            </thead>
            <tbody>
              {parsed.map((h, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-2 font-semibold text-indigo-600 dark:text-indigo-400">{h.name}</td>
                  <td className="p-2 text-slate-700 dark:text-slate-300 break-all">{h.value}</td>
                  <td className="p-2">
                    {h.isSecurity && <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-sans">Security</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. HTML TABLE TO JSON / CSV
// ==========================================
export const HtmlTableToJsonTool: React.FC = () => {
  const [html, setHtml] = useState<string>(
    `<table>
  <thead>
    <tr><th>ID</th><th>Product</th><th>Price</th><th>Stock</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>Wireless Mouse</td><td>$29.99</td><td>142</td></tr>
    <tr><td>2</td><td>Mechanical Keyboard</td><td>$89.50</td><td>68</td></tr>
    <tr><td>3</td><td>4K Monitor</td><td>$349.00</td><td>15</td></tr>
  </tbody>
</table>`
  );
  const [outputFormat, setOutputFormat] = useState<'json' | 'csv'>('json');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const table = doc.querySelector('table');
      if (!table) return 'No <table> element found in input.';

      const headers: string[] = [];
      const ths = table.querySelectorAll('th');
      if (ths.length > 0) {
        ths.forEach(th => headers.push(th.textContent?.trim() || ''));
      }

      const rows: string[][] = [];
      table.querySelectorAll('tbody tr, tr').forEach(tr => {
        const tds = tr.querySelectorAll('td');
        if (tds.length > 0) {
          const rowData: string[] = [];
          tds.forEach(td => rowData.push(td.textContent?.trim() || ''));
          rows.push(rowData);
        }
      });

      if (outputFormat === 'csv') {
        const headerLine = headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',');
        const rowLines = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(','));
        return (headers.length ? [headerLine, ...rowLines] : rowLines).join('\n');
      }

      // JSON output
      const jsonOutput = rows.map(r => {
        const obj: Record<string, string> = {};
        r.forEach((val, i) => {
          const key = headers[i] || `col_${i + 1}`;
          obj[key] = val;
        });
        return obj;
      });
      return JSON.stringify(jsonOutput, null, 2);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  }, [html, outputFormat]);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const type = outputFormat === 'json' ? 'application/json' : 'text/csv';
    const blob = new Blob([result], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `table-export.${outputFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">HTML Table to JSON & CSV</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden text-xs">
            <button
              onClick={() => setOutputFormat('json')}
              className={`px-3 py-1.5 ${outputFormat === 'json' ? 'bg-indigo-600 text-white font-medium' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
            >
              JSON
            </button>
            <button
              onClick={() => setOutputFormat('csv')}
              className={`px-3 py-1.5 ${outputFormat === 'csv' ? 'bg-indigo-600 text-white font-medium' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
            >
              CSV
            </button>
          </div>
          <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Paste HTML Table</label>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={12}
            className="w-full p-3 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Generated {outputFormat.toUpperCase()}</label>
          <textarea
            readOnly
            value={result}
            rows={12}
            className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. CSV TO MARKDOWN TABLE
// ==========================================
export const CsvToMarkdownTableTool: React.FC = () => {
  const [csv, setCsv] = useState<string>(
    `Feature,Free Tier,Pro Tier,Enterprise
Max Storage,5 GB,100 GB,Unlimited
Monthly Bandwidth,10 GB,500 GB,10 TB
API Rate Limit,100/min,5000/min,Dedicated
Support,Community,24/7 Priority,Dedicated Engineer`
  );
  const [copied, setCopied] = useState(false);

  const markdown = useMemo(() => {
    const lines = csv.trim().split('\n').filter(Boolean);
    if (lines.length === 0) return '';
    const parsedRows = lines.map(line => {
      // Split by comma ignoring commas inside quotes
      return line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    });

    const colCount = Math.max(...parsedRows.map(r => r.length));
    const header = parsedRows[0];
    const divider = Array(colCount).fill('---');
    const body = parsedRows.slice(1);

    const formatRow = (r: string[]) => {
      const padded = [...r];
      while (padded.length < colCount) padded.push('');
      return `| ${padded.join(' | ')} |`;
    };

    return [formatRow(header), formatRow(divider), ...body.map(formatRow)].join('\n');
  }, [csv]);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">CSV to Markdown Table</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Markdown'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">CSV Source</label>
          <textarea
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            rows={10}
            className="w-full p-3 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Markdown Table</label>
          <textarea
            readOnly
            value={markdown}
            rows={10}
            className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. SQL MINIFIER
// ==========================================
export const SqlMinifierTool: React.FC = () => {
  const [sql, setSql] = useState<string>(
    `-- Fetch all active enterprise accounts with revenue > $100k
SELECT 
    u.id AS user_id,
    u.first_name,
    u.last_name,
    c.company_name,
    SUM(o.total_amount) AS lifetime_value
FROM 
    users u
INNER JOIN 
    companies c ON u.company_id = c.id
LEFT JOIN 
    orders o ON o.user_id = u.id
WHERE 
    u.is_active = 1
    AND o.status = 'COMPLETED'
GROUP BY 
    u.id, c.company_name
HAVING 
    SUM(o.total_amount) > 100000
ORDER BY 
    lifetime_value DESC
LIMIT 50;`
  );
  const [copied, setCopied] = useState(false);

  const minified = useMemo(() => {
    return sql
      .replace(/--.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([,;=()])\s*/g, '$1 ')
      .trim();
  }, [sql]);

  const handleCopy = () => {
    navigator.clipboard.writeText(minified);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">SQL Query Minifier</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Single-Line SQL'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Original Multi-Line SQL</label>
          <textarea
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            rows={12}
            className="w-full p-3 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Minified Single-Line SQL</label>
          <textarea
            readOnly
            value={minified}
            rows={12}
            className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. JSON PATCH BUILDER (RFC 6902)
// ==========================================
export const JsonPatchBuilderTool: React.FC = () => {
  const [docA, setDocA] = useState<string>(
    JSON.stringify({ title: "PocketKit", version: "1.0.0", features: ["fast", "clean"], author: { name: "Dev" } }, null, 2)
  );
  const [docB, setDocB] = useState<string>(
    JSON.stringify({ title: "PocketKit Pro", version: "2.0.0", features: ["fast", "clean", "100+ tools"], author: { name: "Lead Dev", role: "admin" } }, null, 2)
  );
  const [copied, setCopied] = useState(false);

  const patches = useMemo(() => {
    try {
      const a = JSON.parse(docA);
      const b = JSON.parse(docB);
      const ops: Array<{ op: string; path: string; value?: any }> = [];

      const compare = (path: string, objA: any, objB: any) => {
        if (typeof objA !== typeof objB || objA === null || objB === null || Array.isArray(objA) !== Array.isArray(objB)) {
          ops.push({ op: "replace", path: path || "/", value: objB });
          return;
        }

        if (Array.isArray(objA)) {
          if (JSON.stringify(objA) !== JSON.stringify(objB)) {
            ops.push({ op: "replace", path: path || "/", value: objB });
          }
          return;
        }

        if (typeof objA === 'object') {
          const keysA = Object.keys(objA);
          const keysB = Object.keys(objB);

          for (const k of keysA) {
            if (!(k in objB)) {
              ops.push({ op: "remove", path: `${path}/${k}` });
            } else {
              compare(`${path}/${k}`, objA[k], objB[k]);
            }
          }

          for (const k of keysB) {
            if (!(k in objA)) {
              ops.push({ op: "add", path: `${path}/${k}`, value: objB[k] });
            }
          }
          return;
        }

        if (objA !== objB) {
          ops.push({ op: "replace", path: path || "/", value: objB });
        }
      };

      compare("", a, b);
      return JSON.stringify(ops, null, 2);
    } catch (e: any) {
      return `Error comparing JSON: ${e.message}`;
    }
  }, [docA, docB]);

  const handleCopy = () => {
    navigator.clipboard.writeText(patches);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">RFC 6902 JSON Patch Builder</span>
        </div>
        <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          Copy JSON Patch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Original Document (A)</label>
          <textarea
            value={docA}
            onChange={(e) => setDocA(e.target.value)}
            rows={10}
            className="w-full p-3 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Target Document (B)</label>
          <textarea
            value={docB}
            onChange={(e) => setDocB(e.target.value)}
            rows={10}
            className="w-full p-3 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Generated JSON Patch Ops</label>
          <textarea
            readOnly
            value={patches}
            rows={10}
            className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. BSON OBJECTID GENERATOR & DECODER
// ==========================================
export const BsonObjectIdTool: React.FC = () => {
  const [count, setCount] = useState<number>(5);
  const [ids, setIds] = useState<string[]>([]);
  const [inspectId, setInspectId] = useState<string>('671a5e1288b43f9a7123abcd');
  const [copied, setCopied] = useState(false);

  const generateIds = () => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
      const randomBytes = Array.from(crypto.getRandomValues(new Uint8Array(8)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      list.push(timestamp + randomBytes);
    }
    setIds(list);
  };

  useMemo(() => {
    if (ids.length === 0) generateIds();
  }, []);

  const decoded = useMemo(() => {
    if (inspectId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(inspectId)) {
      return { valid: false, timestamp: null, date: null };
    }
    const hexTime = inspectId.substring(0, 8);
    const unix = parseInt(hexTime, 16);
    return {
      valid: true,
      timestamp: unix,
      date: new Date(unix * 1000).toUTCString(),
    };
  }, [inspectId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">MongoDB BSON ObjectId Generator & Decoder</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={generateIds} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
            <Sparkles className="w-3.5 h-3.5" /> Generate New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Generated ObjectIDs</label>
            <button
              onClick={() => {
                navigator.clipboard.writeText(ids.join('\n'));
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-xs text-indigo-600 dark:text-indigo-400"
            >
              {copied ? 'Copied All!' : 'Copy All'}
            </button>
          </div>
          <div className="space-y-1 font-mono text-xs">
            {ids.map((id, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                <span className="text-indigo-600 dark:text-indigo-300">{id}</span>
                <button
                  onClick={() => setInspectId(id)}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Inspect
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Decode Timestamp</label>
          <input
            type="text"
            value={inspectId}
            onChange={(e) => setInspectId(e.target.value.trim())}
            placeholder="24-character hexadecimal ObjectId"
            className="w-full p-2.5 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
          {decoded.valid ? (
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg space-y-1 text-xs">
              <div><span className="font-semibold text-indigo-900 dark:text-indigo-200">Creation Date:</span> {decoded.date}</div>
              <div><span className="font-semibold text-indigo-900 dark:text-indigo-200">Unix Timestamp:</span> {decoded.timestamp} s</div>
            </div>
          ) : (
            <div className="text-xs text-rose-500">Invalid 24-char hex ObjectId.</div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 9. NANOID GENERATOR
// ==========================================
export const NanoidGeneratorTool: React.FC = () => {
  const [size, setSize] = useState<number>(21);
  const [alphabet, setAlphabet] = useState<string>('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-');
  const [count, setCount] = useState<number>(10);
  const [ids, setIds] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const list: string[] = [];
    const len = alphabet.length;
    for (let c = 0; c < count; c++) {
      let id = '';
      const randomValues = crypto.getRandomValues(new Uint8Array(size));
      for (let i = 0; i < size; i++) {
        id += alphabet[randomValues[i] % len];
      }
      list.push(id);
    }
    setIds(list);
  };

  useMemo(() => {
    if (ids.length === 0) generate();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Nano ID Cryptographic Generator</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={generate} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
            <Sparkles className="w-3.5 h-3.5" /> Generate
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(ids.join('\n'));
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            Copy All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">ID Length: {size}</label>
          <input
            type="range"
            min={6}
            max={64}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Count: {count}</label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full p-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Custom Alphabet</label>
          <input
            type="text"
            value={alphabet}
            onChange={(e) => setAlphabet(e.target.value)}
            className="w-full p-2 font-mono text-xs border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-900"
          />
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 font-mono text-xs">
        {ids.map((id, i) => (
          <div key={i} className="p-2 rounded bg-slate-50 dark:bg-slate-800/50 flex justify-between">
            <span className="text-indigo-600 dark:text-indigo-300">{id}</span>
            <span className="text-slate-400 text-[10px]">#{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 10. ULID GENERATOR & DECODER
// ==========================================
export const UlidGeneratorTool: React.FC = () => {
  const [ulids, setUlids] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Crockford's Base32 alphabet
  const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

  const generateUlid = (): string => {
    const time = Date.now();
    let timeStr = "";
    let t = time;
    for (let i = 9; i >= 0; i--) {
      timeStr = ENCODING[t % 32] + timeStr;
      t = Math.floor(t / 32);
    }
    const rand = crypto.getRandomValues(new Uint8Array(16));
    let randStr = "";
    for (let i = 0; i < 16; i++) {
      randStr += ENCODING[rand[i] % 32];
    }
    return timeStr + randStr;
  };

  const handleGenerate = () => {
    const arr: string[] = [];
    for (let i = 0; i < 6; i++) arr.push(generateUlid());
    setUlids(arr);
  };

  useMemo(() => {
    if (ulids.length === 0) handleGenerate();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">ULID Generator (Universally Unique Lexicographically Sortable Identifier)</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleGenerate} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
            <Sparkles className="w-3.5 h-3.5" /> Generate Batch
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(ulids.join('\n'));
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            Copy
          </button>
        </div>
      </div>

      <div className="space-y-2 font-mono text-xs">
        {ulids.map((u, i) => (
          <div key={i} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">{u.slice(0, 10)}</span>
              <span className="text-slate-600 dark:text-slate-400">{u.slice(10)}</span>
            </div>
            <span className="text-[10px] text-slate-400">Sortable 128-bit</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 11. BASE58 & BASE32 CONVERTER
// ==========================================
export const Base58ConverterTool: React.FC = () => {
  const [input, setInput] = useState<string>('Hello PocketKit! Web3 & Bitcoin');
  const [mode, setMode] = useState<'base58' | 'base32'>('base58');
  const [copied, setCopied] = useState(false);

  const B58_CHARS = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

  const encodeBase58 = (str: string): string => {
    const bytes = new TextEncoder().encode(str);
    const digits: number[] = [0];
    for (let i = 0; i < bytes.length; i++) {
      for (let j = 0; j < digits.length; j++) digits[j] <<= 8;
      digits[0] += bytes[i];
      let carry = 0;
      for (let j = 0; j < digits.length; ++j) {
        digits[j] += carry;
        carry = (digits[j] / 58) | 0;
        digits[j] %= 58;
      }
      while (carry) {
        digits.push(carry % 58);
        carry = (carry / 58) | 0;
      }
    }
    let res = '';
    for (let i = 0; i < bytes.length && bytes[i] === 0; i++) res += '1';
    for (let i = digits.length - 1; i >= 0; i--) res += B58_CHARS[digits[i]];
    return res;
  };

  const encodeBase32 = (str: string): string => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const bytes = new TextEncoder().encode(str);
    let bits = 0;
    let value = 0;
    let output = '';
    for (let i = 0; i < bytes.length; i++) {
      value = (value << 8) | bytes[i];
      bits += 8;
      while (bits >= 5) {
        output += alphabet[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }
    if (bits > 0) {
      output += alphabet[(value << (5 - bits)) & 31];
    }
    while (output.length % 8 !== 0) output += '=';
    return output;
  };

  const output = useMemo(() => {
    if (!input) return '';
    return mode === 'base58' ? encodeBase58(input) : encodeBase32(input);
  }, [input, mode]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Base58 & Base32 Encoder</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden text-xs">
            <button
              onClick={() => setMode('base58')}
              className={`px-3 py-1.5 ${mode === 'base58' ? 'bg-indigo-600 text-white font-medium' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
            >
              Base58 (Bitcoin)
            </button>
            <button
              onClick={() => setMode('base32')}
              className={`px-3 py-1.5 ${mode === 'base32' ? 'bg-indigo-600 text-white font-medium' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
            >
              Base32 (RFC 4648)
            </button>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(output);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            Copy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Plain Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
            className="w-full p-3 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Encoded ({mode.toUpperCase()})</label>
          <textarea
            readOnly
            value={output}
            rows={8}
            className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 12. DOCKER COMPOSE VALIDATOR
// ==========================================
export const DockerComposeValidatorTool: React.FC = () => {
  const [yamlContent, setYamlContent] = useState<string>(
    `version: '3.8'

services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./html:/usr/share/nginx/html:ro
    restart: always

  api:
    build: .
    environment:
      - NODE_ENV=production
      - PORT=3000
    depends_on:
      - db
    ports:
      - "3000:3000"

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: pocketkit
      POSTGRES_PASSWORD: secret_password
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:`
  );

  const inspected = useMemo(() => {
    const lines = yamlContent.split('\n');
    const services: string[] = [];
    const ports: string[] = [];
    let insideServices = false;
    let currentService = '';

    for (const rawLine of lines) {
      const line = rawLine.trimEnd();
      if (/^services:\s*$/.test(line)) {
        insideServices = true;
        continue;
      }
      if (/^[a-zA-Z0-9_-]+:\s*$/.test(line) && !line.startsWith(' ') && !line.startsWith('services:')) {
        insideServices = false;
      }
      if (insideServices) {
        const matchService = rawLine.match(/^  ([a-zA-Z0-9_-]+):\s*$/);
        if (matchService) {
          currentService = matchService[1];
          services.push(currentService);
        }
        const matchPort = rawLine.match(/-\s*["']?([0-9]+:[0-9]+)["']?/);
        if (matchPort) {
          ports.push(`${currentService}: ${matchPort[1]}`);
        }
      }
    }

    return {
      serviceCount: services.length,
      services,
      ports,
      valid: services.length > 0,
    };
  }, [yamlContent]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Docker Compose YAML Validator</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">docker-compose.yml</label>
          <textarea
            value={yamlContent}
            onChange={(e) => setYamlContent(e.target.value)}
            rows={14}
            className="w-full p-3 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
          <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Parsed Containers & Services</h4>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs space-y-2">
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300">Detected Services ({inspected.services.length}):</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {inspected.services.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-mono text-[11px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300">Exposed Ports:</span>
              <ul className="list-disc list-inside font-mono text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                {inspected.ports.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 13. GIT CHEATSHEET & COMMAND BUILDER
// ==========================================
export const GitCheatsheetTool: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const gitCommands = [
    { cat: 'Branching', cmd: 'git checkout -b <new-branch>', desc: 'Create and switch to a new branch' },
    { cat: 'Branching', cmd: 'git branch -d <branch-name>', desc: 'Safely delete a merged local branch' },
    { cat: 'Undo', cmd: 'git reset --soft HEAD~1', desc: 'Undo last commit, keeping all changed files staged' },
    { cat: 'Undo', cmd: 'git restore --staged <file>', desc: 'Unstage a file while keeping your modifications' },
    { cat: 'Stash', cmd: 'git stash push -m "wip save"', desc: 'Stash current modifications with custom note' },
    { cat: 'Stash', cmd: 'git stash pop', desc: 'Apply and drop the most recent stash entry' },
    { cat: 'Commit', cmd: 'git commit --amend --no-edit', desc: 'Add staged changes to the previous commit without changing commit message' },
    { cat: 'Cherry-pick', cmd: 'git cherry-pick <commit-hash>', desc: 'Apply the changes introduced by some existing commit' },
    { cat: 'Rebase', cmd: 'git rebase -i HEAD~3', desc: 'Interactively squash or edit the last 3 commits' },
    { cat: 'Remote', cmd: 'git remote prune origin', desc: 'Delete remote-tracking branches that no longer exist on remote' },
    { cat: 'Log', cmd: 'git log --oneline --graph --all', desc: 'View compact visual commit tree history' },
    { cat: 'Diff', cmd: 'git diff --stat', desc: 'Show summary of file additions and deletions' },
  ];

  const filtered = gitCommands.filter(c =>
    c.cmd.toLowerCase().includes(filter.toLowerCase()) ||
    c.desc.toLowerCase().includes(filter.toLowerCase()) ||
    c.cat.toLowerCase().includes(filter.toLowerCase())
  );

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Interactive Git Command Cheatsheet</span>
        </div>
        <div className="w-full sm:w-64">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search git commands..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((item, idx) => (
          <div key={idx} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">{item.cat}</span>
              <button
                onClick={() => copyCommand(item.cmd)}
                className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600"
              >
                {copiedCmd === item.cmd ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copiedCmd === item.cmd ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-2 rounded bg-slate-900 text-emerald-400 font-mono text-xs select-all">
              {item.cmd}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 14. MIME TYPE QUICK LOOKUP
// ==========================================
export const MimeTypeLookupTool: React.FC = () => {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const MIME_DATA = [
    { ext: '.json', type: 'application/json', desc: 'JavaScript Object Notation' },
    { ext: '.pdf', type: 'application/pdf', desc: 'Adobe Portable Document Format' },
    { ext: '.png', type: 'image/png', desc: 'Portable Network Graphics' },
    { ext: '.jpg / .jpeg', type: 'image/jpeg', desc: 'JPEG Image' },
    { ext: '.webp', type: 'image/webp', desc: 'WebP Image' },
    { ext: '.svg', type: 'image/svg+xml', desc: 'Scalable Vector Graphics' },
    { ext: '.html', type: 'text/html', desc: 'HyperText Markup Language' },
    { ext: '.css', type: 'text/css', desc: 'Cascading Style Sheets' },
    { ext: '.js', type: 'text/javascript', desc: 'JavaScript' },
    { ext: '.ts', type: 'application/typescript', desc: 'TypeScript' },
    { ext: '.csv', type: 'text/csv', desc: 'Comma-Separated Values' },
    { ext: '.zip', type: 'application/zip', desc: 'ZIP Archive' },
    { ext: '.mp3', type: 'audio/mpeg', desc: 'MP3 Audio' },
    { ext: '.wav', type: 'audio/wav', desc: 'WAV Audio' },
    { ext: '.mp4', type: 'video/mp4', desc: 'MP4 Video' },
    { ext: '.woff2', type: 'font/woff2', desc: 'Web Open Font Format 2' },
  ];

  const results = MIME_DATA.filter(m =>
    m.ext.toLowerCase().includes(search.toLowerCase()) ||
    m.type.toLowerCase().includes(search.toLowerCase()) ||
    m.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">MIME Content-Type Lookup</span>
        </div>
        <input
          type="text"
          placeholder="Filter by extension or mime..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
        />
      </div>

      <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
              <th className="p-3">Extension</th>
              <th className="p-3">MIME Type</th>
              <th className="p-3 font-sans">Description</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">{r.ext}</td>
                <td className="p-3 text-slate-700 dark:text-slate-300">{r.type}</td>
                <td className="p-3 font-sans text-slate-500">{r.desc}</td>
                <td className="p-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(r.type);
                      setCopied(r.type);
                      setTimeout(() => setCopied(null), 1500);
                    }}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-sans"
                  >
                    {copied === r.type ? 'Copied' : 'Copy'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// 15. .ENV TO JSON CONVERTER
// ==========================================
export const EnvToJsonTool: React.FC = () => {
  const [envText, setEnvText] = useState<string>(
    `# Application Settings
NODE_ENV=production
PORT=3000
DATABASE_URL="postgres://user:secret@localhost:5432/mydb"
API_SECRET_KEY=9f8e7d6c5b4a3120
ENABLE_FEATURE_FLAGS=true
TIMEOUT_SECONDS=60`
  );
  const [copied, setCopied] = useState(false);

  const jsonOutput = useMemo(() => {
    const lines = envText.split('\n');
    const result: Record<string, any> = {};

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const idx = line.indexOf('=');
      if (idx !== -1) {
        const key = line.substring(0, idx).trim();
        let val = line.substring(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        result[key] = val;
      }
    }
    return JSON.stringify(result, null, 2);
  }, [envText]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">.env to JSON Converter</span>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(jsonOutput);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          Copy JSON
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">.env Text</label>
          <textarea
            value={envText}
            onChange={(e) => setEnvText(e.target.value)}
            rows={10}
            className="w-full p-3 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Converted JSON</label>
          <textarea
            readOnly
            value={jsonOutput}
            rows={10}
            className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 16. REGEX FIND & REPLACE
// ==========================================
export const RegexFindReplaceTool: React.FC = () => {
  const [source, setSource] = useState<string>(
    `User 1: John Smith (john@acme.corp)\nUser 2: Sarah Connor (sarah@sky.net)\nUser 3: Tony Stark (tony@stark.io)`
  );
  const [pattern, setPattern] = useState<string>('([A-Z][a-z]+)\\s+([A-Z][a-z]+)');
  const [replaceWith, setReplaceWith] = useState<string>('$2, $1');
  const [flags, setFlags] = useState<string>('g');
  const [copied, setCopied] = useState(false);

  const { output, error, matchCount } = useMemo(() => {
    try {
      const reg = new RegExp(pattern, flags);
      const matches = source.match(reg);
      const res = source.replace(reg, replaceWith);
      return { output: res, error: null, matchCount: matches ? matches.length : 0 };
    } catch (e: any) {
      return { output: '', error: e.message, matchCount: 0 };
    }
  }, [source, pattern, replaceWith, flags]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">RegEx Replacement & Capture Groups</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">Matches: {matchCount}</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(output);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            Copy Output
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">RegEx Pattern</label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="w-full p-2 font-mono text-xs border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Replace Pattern ($1, $2)</label>
          <input
            type="text"
            value={replaceWith}
            onChange={(e) => setReplaceWith(e.target.value)}
            className="w-full p-2 font-mono text-xs border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Flags (e.g. g, i, m)</label>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            className="w-full p-2 font-mono text-xs border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-900"
          />
        </div>
      </div>

      {error ? (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs rounded-xl">
          Invalid Regex: {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Input Text</label>
            <textarea
              value={source}
              onChange={(e) => setSource(e.target.value)}
              rows={8}
              className="w-full p-3 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Replaced Result</label>
            <textarea
              readOnly
              value={output}
              rows={8}
              className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 17. HEX DUMP INSPECTOR
// ==========================================
export const HexDumpInspectorTool: React.FC = () => {
  const [text, setText] = useState<string>('PocketKit 2026: 100% Client-Side Web Developer Tools!');
  const [copied, setCopied] = useState(false);

  const hexDump = useMemo(() => {
    const bytes = new TextEncoder().encode(text);
    const rows: string[] = [];

    for (let i = 0; i < bytes.length; i += 16) {
      const slice = bytes.slice(i, i + 16);
      const offset = i.toString(16).padStart(8, '0');
      const hexParts = Array.from(slice).map(b => b.toString(16).padStart(2, '0'));
      while (hexParts.length < 16) hexParts.push('  ');

      const hexStr = `${hexParts.slice(0, 8).join(' ')}  ${hexParts.slice(8).join(' ')}`;
      const asciiStr = Array.from(slice)
        .map(b => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '.'))
        .join('');

      rows.push(`${offset}  ${hexStr}  |${asciiStr}|`);
    }
    return rows.join('\n');
  }, [text]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Hex Dump & Byte Offset Inspector</span>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(hexDump);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          Copy Hex Dump
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Input Text / String</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full p-2.5 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
        />
      </div>

      <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto whitespace-pre">
        {hexDump || 'Empty input'}
      </div>
    </div>
  );
};

// ==========================================
// 18. STRING ESCAPER & UNESCAPER
// ==========================================
export const StringEscaperTool: React.FC = () => {
  const [input, setInput] = useState<string>(`SELECT * FROM users WHERE name = "O'Connor" AND bio = "Hello\\nWorld";`);
  const [lang, setLang] = useState<'json' | 'js' | 'sql' | 'html'>('js');
  const [copied, setCopied] = useState(false);

  const escaped = useMemo(() => {
    switch (lang) {
      case 'json':
        return JSON.stringify(input);
      case 'js':
        return input.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
      case 'sql':
        return input.replace(/'/g, "''");
      case 'html':
        return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
      default:
        return input;
    }
  }, [input, lang]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Multi-Language String Escaper</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden text-xs">
            {(['js', 'json', 'sql', 'html'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 uppercase ${lang === l ? 'bg-indigo-600 text-white font-bold' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
              >
                {l}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(escaped);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            Copy
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Raw Unescaped String</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
            className="w-full p-3 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Escaped Output ({lang.toUpperCase()})</label>
          <textarea
            readOnly
            value={escaped}
            rows={8}
            className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 19. KEYBOARD KEYCODE INSPECTOR
// ==========================================
export const KeyboardKeycodeInspectorTool: React.FC = () => {
  const [lastKey, setLastKey] = useState<any>({
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
    which: 13,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    metaKey: false,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Interactive Keyboard KeyCode Inspector</span>
        </div>
      </div>

      <div
        tabIndex={0}
        onKeyDown={(e) => {
          setLastKey({
            key: e.key,
            code: e.code,
            keyCode: e.keyCode,
            which: e.which,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey,
            altKey: e.altKey,
            metaKey: e.metaKey,
          });
        }}
        className="p-8 text-center bg-white dark:bg-slate-900 border-2 border-dashed border-indigo-400 dark:border-indigo-600 rounded-2xl cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
      >
        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
          Click here and press ANY key on your keyboard
        </span>
        <div className="mt-4 text-5xl font-mono font-extrabold text-slate-900 dark:text-white">
          {lastKey.key === ' ' ? 'Space' : lastKey.key}
        </div>
        <div className="mt-2 text-xs text-slate-500">
          keyCode: <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{lastKey.keyCode}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
          <span className="text-slate-500 text-[10px]">event.code</span>
          <p className="font-bold text-slate-800 dark:text-slate-200">{lastKey.code}</p>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
          <span className="text-slate-500 text-[10px]">event.key</span>
          <p className="font-bold text-slate-800 dark:text-slate-200">{lastKey.key}</p>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
          <span className="text-slate-500 text-[10px]">event.which</span>
          <p className="font-bold text-slate-800 dark:text-slate-200">{lastKey.which}</p>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
          <span className="text-slate-500 text-[10px]">Modifiers</span>
          <p className="font-bold text-slate-800 dark:text-slate-200">
            {[lastKey.ctrlKey && 'Ctrl', lastKey.shiftKey && 'Shift', lastKey.altKey && 'Alt', lastKey.metaKey && 'Meta'].filter(Boolean).join(' + ') || 'None'}
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 20. TAILWIND CLASS SORTER
// ==========================================
export const TailwindClassSorterTool: React.FC = () => {
  const [classes, setClasses] = useState<string>(
    `p-4 text-center rounded-2xl flex hover:bg-indigo-600 bg-white items-center gap-2 font-bold shadow-lg text-slate-900 border`
  );
  const [copied, setCopied] = useState(false);

  const sortedClasses = useMemo(() => {
    const list = classes.trim().split(/\s+/).filter(Boolean);
    const orderPriority = (cls: string): number => {
      if (/^(container|block|inline-block|inline|flex|inline-flex|grid|hidden)/.test(cls)) return 1;
      if (/^(relative|absolute|fixed|sticky)/.test(cls)) return 2;
      if (/^(top|right|bottom|left|inset|z-)/.test(cls)) return 3;
      if (/^(items-|justify-|content-|self-|gap-)/.test(cls)) return 4;
      if (/^(w-|h-|min-w|min-h|max-w|max-h)/.test(cls)) return 5;
      if (/^(p-|px-|py-|pt-|pr-|pb-|pl-|m-|mx-|my-|mt-|mr-|mb-|ml-)/.test(cls)) return 6;
      if (/^(font-|text-|leading-|tracking-|capitalize|uppercase|lowercase)/.test(cls)) return 7;
      if (/^(bg-|from-|via-|to-)/.test(cls)) return 8;
      if (/^(border|rounded|ring|outline)/.test(cls)) return 9;
      if (/^(shadow|opacity|blur)/.test(cls)) return 10;
      if (/^(transition|duration|ease|delay|animate)/.test(cls)) return 11;
      if (/^(hover:|focus:|active:|dark:)/.test(cls)) return 12;
      return 13;
    };

    return [...list].sort((a, b) => orderPriority(a) - orderPriority(b)).join(' ');
  }, [classes]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Tailwind CSS Class Sorter</span>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(sortedClasses);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          Copy Sorted
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Unordered Tailwind Classes</label>
          <input
            type="text"
            value={classes}
            onChange={(e) => setClasses(e.target.value)}
            className="w-full p-2.5 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Recommended Ordered Output</label>
          <textarea
            readOnly
            value={sortedClasses}
            rows={3}
            className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 21. SEMVER MATCHER & CALCULATOR
// ==========================================
export const SemverMatcherTool: React.FC = () => {
  const [version, setVersion] = useState<string>('2.4.1');
  const [range, setRange] = useState<string>('^2.0.0');

  const result = useMemo(() => {
    const parse = (v: string) => {
      const m = v.match(/^v?(\d+)\.(\d+)\.(\d+)/);
      if (!m) return null;
      return { major: parseInt(m[1], 10), minor: parseInt(m[2], 10), patch: parseInt(m[3], 10) };
    };

    const target = parse(version);
    if (!target) return { valid: false, matches: false, reason: 'Invalid target version string' };

    let matches = false;
    if (range.startsWith('^')) {
      const base = parse(range.slice(1));
      if (base) {
        matches = target.major === base.major && (target.minor > base.minor || (target.minor === base.minor && target.patch >= base.patch));
      }
    } else if (range.startsWith('~')) {
      const base = parse(range.slice(1));
      if (base) {
        matches = target.major === base.major && target.minor === base.minor && target.patch >= base.patch;
      }
    } else {
      const base = parse(range);
      if (base) {
        matches = target.major === base.major && target.minor === base.minor && target.patch === base.patch;
      }
    }

    return { valid: true, matches, reason: matches ? 'Version satisfies range selector' : 'Version does NOT satisfy range selector' };
  }, [version, range]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Semantic Version (SemVer) Matcher</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Target Version (e.g. 2.4.1)</label>
          <input
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value.trim())}
            className="w-full p-2.5 font-mono text-xs border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-900"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Range Expression (^2.0.0 or ~2.4.0)</label>
          <input
            type="text"
            value={range}
            onChange={(e) => setRange(e.target.value.trim())}
            className="w-full p-2.5 font-mono text-xs border border-slate-300 dark:border-slate-700 rounded-lg dark:bg-slate-900"
          />
        </div>
      </div>

      <div className={`p-4 rounded-xl border ${result.matches ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300' : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300'}`}>
        <div className="flex items-center gap-2 font-semibold text-sm">
          {result.matches ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
          <span className={result.matches ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'}>
            {result.reason}
          </span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 22. JSONL / NDJSON CONVERTER
// ==========================================
export const JsonlFormatterTool: React.FC = () => {
  const [jsonText, setJsonText] = useState<string>(
    JSON.stringify([
      { id: 1, name: "Alpha", status: "ok" },
      { id: 2, name: "Beta", status: "pending" },
      { id: 3, name: "Gamma", status: "completed" }
    ], null, 2)
  );
  const [copied, setCopied] = useState(false);

  const jsonlOutput = useMemo(() => {
    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed)) {
        return parsed.map(item => JSON.stringify(item)).join('\n');
      }
      return JSON.stringify(parsed);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  }, [jsonText]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">JSON to JSON Lines (JSONL / NDJSON)</span>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(jsonlOutput);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          Copy JSONL
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">JSON Array</label>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={10}
            className="w-full p-3 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">JSONL / NDJSON (One Line per Object)</label>
          <textarea
            readOnly
            value={jsonlOutput}
            rows={10}
            className="w-full p-3 font-mono text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};
