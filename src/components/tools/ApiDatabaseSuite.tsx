import React, { useState, useMemo } from 'react';
import { Copy, Check, Download, Terminal, Database, Code2, CheckCircle2, ArrowRightLeft, Layers } from 'lucide-react';

function downloadFile(content: string, filename: string, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ==========================================
// 1. CURL TO MULTI-LANGUAGE CONVERTER
// ==========================================
export const CurlToMultiLanguageTool: React.FC = () => {
  const [curlInput, setCurlInput] = useState(
    `curl -X POST https://api.example.com/v1/orders \\\n  -H "Authorization: Bearer sec_live_998877" \\\n  -H "Content-Type: application/json" \\\n  -d '{"itemId": "prod_123", "qty": 2, "currency": "USD"}'`
  );
  const [targetLang, setTargetLang] = useState<'node' | 'python' | 'go' | 'rust'>('node');
  const [copied, setCopied] = useState(false);

  const convertedCode = useMemo(() => {
    // Parse URL, Method, Headers, and Body from curl
    let url = 'https://api.example.com';
    const urlMatch = curlInput.match(/curl\s+(?:-X\s+[A-Z]+\s+)?['"]?(https?:\/\/[^\s'"\\]+)/i);
    if (urlMatch) url = urlMatch[1];

    let method = 'GET';
    const methodMatch = curlInput.match(/-X\s+([A-Z]+)/i);
    if (methodMatch) method = methodMatch[1].toUpperCase();
    else if (curlInput.includes('-d ') || curlInput.includes('--data')) method = 'POST';

    const headers: Record<string, string> = {};
    const headerRegex = /-H\s+['"]([^'"]+)['"]/gi;
    let hMatch;
    while ((hMatch = headerRegex.exec(curlInput)) !== null) {
      const parts = hMatch[1].split(':');
      if (parts.length >= 2) {
        headers[parts[0].trim()] = parts.slice(1).join(':').trim();
      }
    }

    let dataBody = '';
    const bodyMatch = curlInput.match(/(?:-d|--data(?:-raw)?)\s+['"]([\s\S]*?)['"](?:\s|$|\\)/);
    if (bodyMatch) dataBody = bodyMatch[1];

    if (targetLang === 'node') {
      return `// Node.js (fetch)
const response = await fetch("${url}", {
  method: "${method}",
  headers: ${JSON.stringify(headers, null, 2)},
  ${dataBody ? `body: JSON.stringify(${dataBody})` : ''}
});

const data = await response.json();
console.log(data);`;
    }

    if (targetLang === 'python') {
      return `# Python (requests)
import requests

url = "${url}"
headers = ${JSON.stringify(headers, null, 2)}
${dataBody ? `payload = ${dataBody}` : 'payload = None'}

response = requests.request("${method}", url, headers=headers, json=payload)
print(response.json())`;
    }

    if (targetLang === 'go') {
      return `// Golang (net/http)
package main

import (
  "bytes"
  "fmt"
  "io"
  "net/http"
)

func main() {
  url := "${url}"
  ${dataBody ? `var jsonStr = []byte(\`${dataBody}\`)\n  req, _ := http.NewRequest("${method}", url, bytes.NewBuffer(jsonStr))` : `req, _ := http.NewRequest("${method}", url, nil)`}
  
  ${Object.entries(headers)
    .map(([k, v]) => `req.Header.Set("${k}", "${v}")`)
    .join('\n  ')}

  client := &http.Client{}
  resp, err := client.Do(req)
  if err != nil {
    panic(err)
  }
  defer resp.Body.Close()

  body, _ := io.ReadAll(resp.Body)
  fmt.Println(string(body))
}`;
    }

    return `// Rust (reqwest)
use reqwest::header::HeaderMap;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let res = client
        .${method.toLowerCase()}("${url}")
        ${Object.entries(headers)
          .map(([k, v]) => `.header("${k}", "${v}")`)
          .join('\n        ')}
        ${dataBody ? `.body(r#"${dataBody}"#)` : ''}
        .send()
        .await?;

    let text = res.text().await?;
    println!("{}", text);
    Ok(())
}`;
  }, [curlInput, targetLang]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">cURL to Node, Python, Go & Rust Converter</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Transform cURL terminal commands into production HTTP client code</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(convertedCode);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
          <button
            onClick={() => downloadFile(convertedCode, `api_request.${targetLang === 'python' ? 'py' : targetLang === 'go' ? 'go' : targetLang === 'rust' ? 'rs' : 'js'}`)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">cURL Command Input</label>
          <textarea
            value={curlInput}
            onChange={(e) => setCurlInput(e.target.value)}
            rows={12}
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Target Language</label>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              {(['node', 'python', 'go', 'rust'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setTargetLang(lang)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md uppercase transition-colors cursor-pointer ${
                    targetLang === lang
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
          <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto min-h-[220px] max-h-[400px] border border-slate-800 leading-relaxed">
            {convertedCode}
          </pre>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. SQL DIALECT CONVERTER
// ==========================================
export const SqlDialectConverterTool: React.FC = () => {
  const [sourceDialect, setSourceDialect] = useState<'postgres' | 'mysql' | 'sqlite'>('postgres');
  const [targetDialect, setTargetDialect] = useState<'postgres' | 'mysql' | 'sqlite'>('mysql');
  const [sqlInput, setSqlInput] = useState(
    `CREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  username VARCHAR(50) NOT NULL UNIQUE,\n  metadata JSONB,\n  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP\n);`
  );
  const [copied, setCopied] = useState(false);

  const convertedSql = useMemo(() => {
    let res = sqlInput;
    if (sourceDialect === 'postgres' && targetDialect === 'mysql') {
      res = res
        .replace(/SERIAL PRIMARY KEY/gi, 'INT AUTO_INCREMENT PRIMARY KEY')
        .replace(/JSONB/gi, 'JSON')
        .replace(/TIMESTAMPTZ/gi, 'DATETIME')
        .replace(/TEXT\[\]/gi, 'JSON')
        .replace(/BOOLEAN/gi, 'TINYINT(1)')
        .replace(/ILIKE/gi, 'LIKE');
    } else if (sourceDialect === 'mysql' && targetDialect === 'postgres') {
      res = res
        .replace(/INT AUTO_INCREMENT PRIMARY KEY/gi, 'SERIAL PRIMARY KEY')
        .replace(/DATETIME/gi, 'TIMESTAMPTZ')
        .replace(/TINYINT\(1\)/gi, 'BOOLEAN');
    } else if (targetDialect === 'sqlite') {
      res = res
        .replace(/SERIAL PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
        .replace(/INT AUTO_INCREMENT PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
        .replace(/JSONB?/gi, 'TEXT')
        .replace(/TIMESTAMPTZ|DATETIME/gi, 'TEXT')
        .replace(/BOOLEAN/gi, 'INTEGER');
    }
    return res;
  }, [sqlInput, sourceDialect, targetDialect]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">SQL Dialect Converter</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Translate DDL types & queries across PostgreSQL, MySQL, and SQLite</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(convertedSql);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy SQL'}</span>
          </button>
          <button
            onClick={() => downloadFile(convertedSql, `schema_${targetDialect}.sql`, 'text/plain')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">From:</span>
        <select
          value={sourceDialect}
          onChange={(e) => setSourceDialect(e.target.value as any)}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
        >
          <option value="postgres">PostgreSQL</option>
          <option value="mysql">MySQL</option>
          <option value="sqlite">SQLite</option>
        </select>
        <ArrowRightLeft className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">To:</span>
        <select
          value={targetDialect}
          onChange={(e) => setTargetDialect(e.target.value as any)}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
        >
          <option value="mysql">MySQL</option>
          <option value="postgres">PostgreSQL</option>
          <option value="sqlite">SQLite</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <textarea
          value={sqlInput}
          onChange={(e) => setSqlInput(e.target.value)}
          rows={10}
          className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
        />
        <pre className="p-4 rounded-xl bg-slate-900 text-cyan-300 font-mono text-xs overflow-x-auto min-h-[200px] border border-slate-800 leading-relaxed">
          {convertedSql}
        </pre>
      </div>
    </div>
  );
};

// ==========================================
// 3. JSON TO ZOD SCHEMA GENERATOR
// ==========================================
export const JsonToZodSchemaTool: React.FC = () => {
  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(
      {
        id: "usr_99812",
        name: "Devon Vance",
        email: "devon@example.com",
        age: 28,
        isVerified: true,
        tags: ["sre", "kubernetes", "typescript"],
        address: {
          city: "San Francisco",
          zipCode: 94107
        }
      },
      null,
      2
    )
  );
  const [schemaName, setSchemaName] = useState('UserSchema');
  const [copied, setCopied] = useState(false);

  const zodCode = useMemo(() => {
    function generateZod(val: any, indent = '  '): string {
      if (val === null || val === undefined) return 'z.null()';
      if (typeof val === 'string') return 'z.string()';
      if (typeof val === 'number') return Number.isInteger(val) ? 'z.number().int()' : 'z.number()';
      if (typeof val === 'boolean') return 'z.boolean()';
      if (Array.isArray(val)) {
        const itemType = val.length > 0 ? generateZod(val[0], indent) : 'z.unknown()';
        return `z.array(${itemType})`;
      }
      if (typeof val === 'object') {
        const lines = Object.entries(val).map(([k, v]) => `${indent}  ${k}: ${generateZod(v, indent + '  ')},`);
        return `z.object({\n${lines.join('\n')}\n${indent}})`;
      }
      return 'z.unknown()';
    }

    try {
      const parsed = JSON.parse(jsonInput);
      const schemaBody = generateZod(parsed);
      return `import { z } from "zod";

export const ${schemaName} = ${schemaBody};

export type ${schemaName.replace(/Schema$/, '') || 'Data'} = z.infer<typeof ${schemaName}>;`;
    } catch (err: any) {
      return `// JSON Syntax Error: ${err.message}`;
    }
  }, [jsonInput, schemaName]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">JSON to Zod Schema Generator</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Generate strongly typed TypeScript Zod schema objects with inferred types</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(zodCode);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Zod'}</span>
          </button>
          <button
            onClick={() => downloadFile(zodCode, `${schemaName}.ts`, 'text/plain')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .ts</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">JSON Input</label>
            <input
              type="text"
              value={schemaName}
              onChange={(e) => setSchemaName(e.target.value)}
              placeholder="Schema Name"
              className="px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={12}
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Generated Zod Schema</label>
          <pre className="p-4 rounded-xl bg-slate-900 text-purple-300 font-mono text-xs overflow-x-auto min-h-[220px] max-h-[400px] border border-slate-800 leading-relaxed">
            {zodCode}
          </pre>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. REST STATUS CODE DIRECTORY
// ==========================================
export const RestStatusCodeTool: React.FC = () => {
  const [filter, setFilter] = useState<'all' | '2xx' | '3xx' | '4xx' | '5xx'>('all');
  const [search, setSearch] = useState('');

  const statusCodes = [
    { code: 200, name: 'OK', desc: 'Standard response for successful HTTP requests.', cat: '2xx' },
    { code: 201, name: 'Created', desc: 'Request fulfilled and resulted in a new resource created.', cat: '2xx' },
    { code: 204, name: 'No Content', desc: 'Server successfully processed request but returns no body.', cat: '2xx' },
    { code: 301, name: 'Moved Permanently', desc: 'Resource URI has been permanently redirected.', cat: '3xx' },
    { code: 304, name: 'Not Modified', desc: 'Cached resource is still valid according to ETag / Last-Modified.', cat: '3xx' },
    { code: 400, name: 'Bad Request', desc: 'Malformed syntax or invalid JSON request payload.', cat: '4xx' },
    { code: 401, name: 'Unauthorized', desc: 'Authentication required. Missing or expired token/key.', cat: '4xx' },
    { code: 403, name: 'Forbidden', desc: 'Server understood request but refuses to authorize action.', cat: '4xx' },
    { code: 404, name: 'Not Found', desc: 'Requested resource endpoint could not be found on server.', cat: '4xx' },
    { code: 409, name: 'Conflict', desc: 'Request conflicts with current state of resource (e.g. unique constraint).', cat: '4xx' },
    { code: 422, name: 'Unprocessable Entity', desc: 'Well-formed request but semantic validation errors occurred.', cat: '4xx' },
    { code: 429, name: 'Too Many Requests', desc: 'Client sent too many requests in a given time limit (rate limiting).', cat: '4xx' },
    { code: 500, name: 'Internal Server Error', desc: 'Unexpected generic server failure or unhandled exception.', cat: '5xx' },
    { code: 502, name: 'Bad Gateway', desc: 'Server acting as gateway/proxy received invalid upstream response.', cat: '5xx' },
    { code: 503, name: 'Service Unavailable', desc: 'Server currently unable to handle request due to overload or maintenance.', cat: '5xx' },
    { code: 504, name: 'Gateway Timeout', desc: 'Upstream server failed to respond within configured proxy timeout.', cat: '5xx' },
  ];

  const filtered = statusCodes.filter((item) => {
    if (filter !== 'all' && item.cat !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return item.code.toString().includes(q) || item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">REST HTTP Status Code Diagnostic Directory</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Search HTTP response codes, caching guidelines, and client recovery tips</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search code or text..."
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
        {(['all', '2xx', '3xx', '4xx', '5xx'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md uppercase transition-colors cursor-pointer ${
              filter === cat ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div key={item.code} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-bold font-mono px-2 py-0.5 rounded ${
                item.cat === '2xx' ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400' :
                item.cat === '3xx' ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400' :
                item.cat === '4xx' ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400' :
                'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400'
              }`}>
                {item.code}
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 5. GENERIC API & DATABASE SUITE RUNNER
// ==========================================
interface ApiDatabaseSuiteProps {
  toolId?: string;
}

export const ApiDatabaseSuite: React.FC<ApiDatabaseSuiteProps> = ({ toolId }) => {
  switch (toolId) {
    case 'curl-to-multi-language':
      return <CurlToMultiLanguageTool />;
    case 'sql-dialect-converter':
      return <SqlDialectConverterTool />;
    case 'json-to-zod-schema':
      return <JsonToZodSchemaTool />;
    case 'rest-status-code-directory':
      return <RestStatusCodeTool />;
    default:
      return <CurlToMultiLanguageTool />;
  }
};
