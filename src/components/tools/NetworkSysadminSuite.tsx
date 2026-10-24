import React, { useState, useMemo } from 'react';
import { Copy, Check, Download, Globe, Shield, Network, Cpu, Sliders, Activity, Search } from 'lucide-react';

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
// 1. DNS RECORD & ZONE FILE BUILDER
// ==========================================
export const DnsRecordBuilderTool: React.FC = () => {
  const [domain, setDomain] = useState('example.com');
  const [ipV4, setIpV4] = useState('198.51.100.45');
  const [mailServer, setMailServer] = useState('mail.example.com');
  const [spfInclude, setSpfInclude] = useState('_spf.google.com');
  const [ttl, setTtl] = useState(3600);
  const [copied, setCopied] = useState(false);

  const zoneFile = useMemo(() => {
    return `; Zone file for ${domain}
$ORIGIN ${domain}.
$TTL ${ttl}

; SOA Record
@       IN  SOA ns1.${domain}. hostmaster.${domain}. (
                2026102401 ; serial
                7200       ; refresh
                3600       ; retry
                1209600    ; expire
                3600 )     ; minimum

; Name Servers
@       IN  NS  ns1.${domain}.
@       IN  NS  ns2.${domain}.

; Address Records
@       IN  A     ${ipV4}
www     IN  CNAME @
mail    IN  A     ${ipV4}

; Mail Exchange
@       IN  MX 10 ${mailServer}.

; Email Authentication (SPF, DMARC)
@       IN  TXT   "v=spf1 include:${spfInclude} ~all"
_dmarc  IN  TXT   "v=DMARC1; p=reject; rua=mailto:dmarc-reports@${domain}; pct=100"
`;
  }, [domain, ipV4, mailServer, spfInclude, ttl]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">DNS Zone File & Record Builder</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Generate standard BIND zone files with A, CNAME, MX, SPF, and DMARC records</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(zoneFile);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Zone'}</span>
          </button>
          <button
            onClick={() => downloadFile(zoneFile, `${domain}.zone`, 'text/plain')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Domain Apex</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Server IPv4 (A)</label>
            <input
              type="text"
              value={ipV4}
              onChange={(e) => setIpV4(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Mail Host (MX)</label>
            <input
              type="text"
              value={mailServer}
              onChange={(e) => setMailServer(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">SPF include: provider</label>
            <input
              type="text"
              value={spfInclude}
              onChange={(e) => setSpfInclude(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">TTL (seconds)</label>
            <input
              type="number"
              value={ttl}
              onChange={(e) => setTtl(Number(e.target.value))}
              className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Zone File Output</label>
          <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto min-h-[300px] border border-slate-800 leading-relaxed">
            {zoneFile}
          </pre>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. CIDR RANGE SUMMARIZER
// ==========================================
export const CidrRangeSummarizerTool: React.FC = () => {
  const [startIp, setStartIp] = useState('192.168.1.0');
  const [endIp, setEndIp] = useState('192.168.1.255');
  const [copied, setCopied] = useState(false);

  function ipToLong(ip: string): number {
    return ip.split('.').reduce((acc, oct) => ((acc << 8) + parseInt(oct, 10)) >>> 0, 0);
  }

  function longToIp(num: number): string {
    return [
      (num >>> 24) & 255,
      (num >>> 16) & 255,
      (num >>> 8) & 255,
      num & 255
    ].join('.');
  }

  const cidrBlocks = useMemo(() => {
    try {
      let start = ipToLong(startIp);
      const end = ipToLong(endIp);
      if (start > end) return ['Error: Start IP must be less than or equal to End IP'];

      const blocks: string[] = [];
      while (start <= end) {
        let maxBits = 32;
        while (maxBits > 0) {
          const mask = ((0xFFFFFFFF << (32 - (maxBits - 1))) >>> 0);
          if ((start & mask) !== start) break;
          const nextEnd = (start + (1 << (32 - (maxBits - 1))) - 1) >>> 0;
          if (nextEnd > end) break;
          maxBits--;
        }
        blocks.push(`${longToIp(start)}/${maxBits}`);
        start = (start + (1 << (32 - maxBits))) >>> 0;
        if (start === 0) break; // overflow protection
      }
      return blocks;
    } catch (err: any) {
      return [`Error: Invalid IPv4 address`];
    }
  }, [startIp, endIp]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">IP Range to CIDR Block Summarizer</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Convert start and end IP addresses into minimum contiguous CIDR prefixes</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(cidrBlocks.join('\n'));
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy CIDR Blocks'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Start IP Address</label>
            <input
              type="text"
              value={startIp}
              onChange={(e) => setStartIp(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">End IP Address</label>
            <input
              type="text"
              value={endIp}
              onChange={(e) => setEndIp(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Summarized CIDR Blocks</label>
          <div className="p-4 rounded-xl bg-slate-900 text-cyan-300 font-mono text-xs space-y-1.5 min-h-[140px] border border-slate-800">
            {cidrBlocks.map((block, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span>{block}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. MAC OUI VENDOR LOOKUP
// ==========================================
export const MacOuiLookupTool: React.FC = () => {
  const [macInput, setMacInput] = useState('00:1A:2B:3C:4D:5E');

  const KNOWN_OUIS: Record<string, string> = {
    '00:1A:2B': 'Ayecom Technology Co., Ltd.',
    '00:50:56': 'VMware, Inc.',
    '00:0C:29': 'VMware, Inc.',
    '00:1C:42': 'Parallels, Inc.',
    '08:00:27': 'Oracle VirtualBox',
    'DC:A6:32': 'Raspberry Pi Trading Ltd',
    'B8:27:EB': 'Raspberry Pi Foundation',
    'F4:5C:89': 'Apple, Inc.',
    '00:17:88': 'Philips Lighting BV',
    '3C:22:FB': 'Intel Corporate',
    'FC:FB:FB': 'Cisco Systems, Inc.',
  };

  const parsed = useMemo(() => {
    const clean = macInput.replace(/[^a-fA-F0-9]/g, '').toUpperCase();
    if (clean.length < 6) return { valid: false, vendor: 'Invalid MAC address (too short)' };
    const prefix = `${clean.slice(0, 2)}:${clean.slice(2, 4)}:${clean.slice(4, 6)}`;
    const vendor = KNOWN_OUIS[prefix] || 'Private / Unregistered OUI or Random MAC';
    return {
      valid: true,
      oui: prefix,
      vendor,
      formattedColon: clean.match(/.{1,2}/g)?.join(':'),
      formattedHyphen: clean.match(/.{1,2}/g)?.join('-'),
      formattedCisco: clean.match(/.{1,4}/g)?.join('.'),
    };
  }, [macInput]);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-white">MAC Address OUI Vendor Lookup & Formatter</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Parse 48-bit MAC addresses into hardware OUI manufacturer and Cisco formats</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">MAC Address</label>
            <input
              type="text"
              value={macInput}
              onChange={(e) => setMacInput(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>
          {parsed.valid && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">OUI Prefix:</span> <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{parsed.oui}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">IEEE 802:</span> <span className="font-mono text-slate-800 dark:text-slate-200">{parsed.formattedColon}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Windows:</span> <span className="font-mono text-slate-800 dark:text-slate-200">{parsed.formattedHyphen}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Cisco format:</span> <span className="font-mono text-slate-800 dark:text-slate-200">{parsed.formattedCisco}</span></div>
            </div>
          )}
        </div>

        <div className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs flex flex-col justify-center space-y-2 border border-slate-800">
          <span className="text-slate-500 text-[11px] uppercase tracking-wider">Manufacturer / Vendor</span>
          <span className="text-base font-bold text-white">{parsed.vendor}</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. GENERIC NETWORKING SUITE RUNNER
// ==========================================
interface NetworkSysadminSuiteProps {
  toolId?: string;
}

export const NetworkSysadminSuite: React.FC<NetworkSysadminSuiteProps> = ({ toolId }) => {
  switch (toolId) {
    case 'dns-record-builder':
    case 'dmarc-policy-generator':
      return <DnsRecordBuilderTool />;
    case 'cidr-range-summarizer':
      return <CidrRangeSummarizerTool />;
    case 'mac-oui-lookup':
      return <MacOuiLookupTool />;
    default:
      return <DnsRecordBuilderTool />;
  }
};
