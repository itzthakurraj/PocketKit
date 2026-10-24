import React, { useState, useMemo } from 'react';
import {
  Shield,
  KeyRound,
  Lock,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Search,
  Server,
  FileCheck,
  Network,
} from 'lucide-react';
import CryptoJS from 'crypto-js';

// ==========================================
// 1. SUBNET / CIDR IP CALCULATOR
// ==========================================
export const SubnetCidrCalculatorTool: React.FC = () => {
  const [ip, setIp] = useState('192.168.1.100');
  const [cidr, setCidr] = useState(24);
  const [copied, setCopied] = useState(false);

  const subnetInfo = useMemo(() => {
    try {
      const parts = ip.split('.').map(Number);
      if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
        return null;
      }

      const ipNum = (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
      const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
      const wildcard = (~mask) >>> 0;

      const networkNum = (ipNum & mask) >>> 0;
      const broadcastNum = (networkNum | wildcard) >>> 0;

      const numToIp = (n: number) =>
        `${(n >>> 24) & 255}.${(n >>> 16) & 255}.${(n >>> 8) & 255}.${n & 255}`;

      const totalHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : Math.pow(2, 32 - cidr);
      const usableHosts = cidr >= 31 ? 0 : Math.max(0, totalHosts - 2);

      const firstHost = cidr >= 31 ? numToIp(networkNum) : numToIp(networkNum + 1);
      const lastHost = cidr >= 31 ? numToIp(broadcastNum) : numToIp(broadcastNum - 1);

      return {
        ip,
        cidr: `/${cidr}`,
        netmask: numToIp(mask),
        wildcard: numToIp(wildcard),
        network: numToIp(networkNum),
        broadcast: numToIp(broadcastNum),
        firstHost,
        lastHost,
        usableHosts: usableHosts.toLocaleString(),
        totalHosts: totalHosts.toLocaleString(),
      };
    } catch {
      return null;
    }
  }, [ip, cidr]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">IPv4 Subnet & CIDR Mask Calculator</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-slate-600 block mb-1">IP Address</label>
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value.trim())}
            className="w-full p-2.5 font-mono text-sm border rounded-xl dark:bg-slate-900"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600 block mb-1">CIDR Prefix: /{cidr}</label>
          <input
            type="range"
            min={0}
            max={32}
            value={cidr}
            onChange={(e) => setCidr(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>
      </div>

      {subnetInfo && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          {[
            { label: 'Network Address', val: subnetInfo.network },
            { label: 'Broadcast Address', val: subnetInfo.broadcast },
            { label: 'Subnet Netmask', val: subnetInfo.netmask },
            { label: 'Wildcard Mask', val: subnetInfo.wildcard },
            { label: 'Usable Host Range', val: `${subnetInfo.firstHost} - ${subnetInfo.lastHost}` },
            { label: 'Usable Hosts', val: subnetInfo.usableHosts },
            { label: 'Total Addresses', val: subnetInfo.totalHosts },
            { label: 'CIDR Notation', val: `${subnetInfo.ip}${subnetInfo.cidr}` },
          ].map((item, i) => (
            <div key={i} className="p-3 bg-white dark:bg-slate-900 border rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 font-sans">{item.label}</span>
              <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{item.val}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. HMAC GENERATOR
// ==========================================
export const HmacGeneratorTool: React.FC = () => {
  const [message, setMessage] = useState('Secret transaction payload 2026');
  const [secret, setSecret] = useState('super-secret-key-99');
  const [algo, setAlgo] = useState<'SHA256' | 'SHA512' | 'MD5'>('SHA256');
  const [copied, setCopied] = useState(false);

  const hmacOutput = useMemo(() => {
    if (!message || !secret) return '';
    if (algo === 'SHA256') return CryptoJS.HmacSHA256(message, secret).toString();
    if (algo === 'SHA512') return CryptoJS.HmacSHA512(message, secret).toString();
    return CryptoJS.HmacMD5(message, secret).toString();
  }, [message, secret, algo]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Cryptographic HMAC Message Authentication</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={algo}
            onChange={(e) => setAlgo(e.target.value as any)}
            className="text-xs px-2.5 py-1.5 border rounded-lg dark:bg-slate-800"
          >
            <option value="SHA256">HMAC-SHA256</option>
            <option value="SHA512">HMAC-SHA512</option>
            <option value="MD5">HMAC-MD5</option>
          </select>
          <button
            onClick={() => {
              navigator.clipboard.writeText(hmacOutput);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            Copy HMAC
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-slate-600 block mb-1">Message Payload</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full p-2.5 font-mono text-xs border rounded-xl dark:bg-slate-900"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600 block mb-1">Secret Key / Salt</label>
          <input
            type="text"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-full p-2.5 font-mono text-xs border rounded-xl dark:bg-slate-900"
          />
        </div>
      </div>

      <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl break-all">
        {hmacOutput || 'Enter message and secret key above'}
      </div>
    </div>
  );
};

// ==========================================
// 3. RSA KEYPAIR GENERATOR (Web Crypto API)
// ==========================================
export const RsaKeypairGeneratorTool: React.FC = () => {
  const [keys, setKeys] = useState<{ pub: string; priv: string } | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateKeys = async () => {
    setGenerating(true);
    try {
      const pair = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt']
      );

      const spki = await window.crypto.subtle.exportKey('spki', pair.publicKey);
      const pkcs8 = await window.crypto.subtle.exportKey('pkcs8', pair.privateKey);

      const toBase64 = (buf: ArrayBuffer) =>
        btoa(String.fromCharCode(...new Uint8Array(buf)));

      const pubPem = `-----BEGIN PUBLIC KEY-----\n${toBase64(spki).match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`;
      const privPem = `-----BEGIN PRIVATE KEY-----\n${toBase64(pkcs8).match(/.{1,64}/g)?.join('\n')}\n-----END PRIVATE KEY-----`;

      setKeys({ pub: pubPem, priv: privPem });
    } catch (err: any) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  useMemo(() => {
    if (!keys) generateKeys();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">RSA 2048-bit Keypair Generator (PEM)</span>
        </div>
        <button
          disabled={generating}
          onClick={generateKeys}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {generating ? 'Generating 2048-bit Key...' : 'Generate New RSA Pair'}
        </button>
      </div>

      {keys && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Public Key (SPKI PEM)</label>
            <textarea
              readOnly
              value={keys.pub}
              rows={8}
              className="w-full p-2.5 font-mono text-[11px] bg-slate-50 dark:bg-slate-950 border rounded-xl"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Private Key (PKCS#8 PEM)</label>
            <textarea
              readOnly
              value={keys.priv}
              rows={8}
              className="w-full p-2.5 font-mono text-[11px] bg-slate-50 dark:bg-slate-950 border rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. NETWORKING PORT QUICK REFERENCE
// ==========================================
export const PortReferenceLookupTool: React.FC = () => {
  const [filter, setFilter] = useState('');

  const PORTS = [
    { port: 21, proto: 'TCP', name: 'FTP', desc: 'File Transfer Protocol' },
    { port: 22, proto: 'TCP', name: 'SSH / SFTP', desc: 'Secure Shell remote terminal' },
    { port: 25, proto: 'TCP', name: 'SMTP', desc: 'Simple Mail Transfer Protocol' },
    { port: 53, proto: 'UDP/TCP', name: 'DNS', desc: 'Domain Name System queries' },
    { port: 80, proto: 'TCP', name: 'HTTP', desc: 'Hypertext Transfer Protocol' },
    { port: 110, proto: 'TCP', name: 'POP3', desc: 'Post Office Protocol' },
    { port: 143, proto: 'TCP', name: 'IMAP', desc: 'Internet Message Access Protocol' },
    { port: 443, proto: 'TCP', name: 'HTTPS', desc: 'Secure HTTP with SSL/TLS' },
    { port: 993, proto: 'TCP', name: 'IMAPS', desc: 'IMAP over TLS' },
    { port: 1433, proto: 'TCP', name: 'MS SQL Server', desc: 'Microsoft SQL database' },
    { port: 3000, proto: 'TCP', name: 'Dev Server', desc: 'React, Node, Vite local development' },
    { port: 3306, proto: 'TCP', name: 'MySQL', desc: 'MySQL Database service' },
    { port: 5432, proto: 'TCP', name: 'PostgreSQL', desc: 'PostgreSQL relational database' },
    { port: 6379, proto: 'TCP', name: 'Redis', desc: 'In-memory Redis key-value store' },
    { port: 8080, proto: 'TCP', name: 'HTTP Alt / Proxy', desc: 'Alternative web server port' },
    { port: 27017, proto: 'TCP', name: 'MongoDB', desc: 'MongoDB NoSQL database engine' },
  ];

  const results = PORTS.filter(p =>
    p.port.toString().includes(filter) ||
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.desc.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Standard Networking Port Reference</span>
        </div>
        <input
          type="text"
          placeholder="Filter by port or service..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full sm:w-64 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border rounded-lg"
        />
      </div>

      <div className="overflow-x-auto border rounded-xl bg-white dark:bg-slate-900">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b text-slate-500">
              <th className="p-3">Port</th>
              <th className="p-3">Protocol</th>
              <th className="p-3 font-sans">Service</th>
              <th className="p-3 font-sans">Description</th>
            </tr>
          </thead>
          <tbody>
            {results.map((p, idx) => (
              <tr key={idx} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-3 font-bold text-indigo-600 dark:text-indigo-400">{p.port}</td>
                <td className="p-3 text-slate-500">{p.proto}</td>
                <td className="p-3 font-sans font-bold text-slate-800 dark:text-slate-200">{p.name}</td>
                <td className="p-3 font-sans text-slate-500">{p.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
