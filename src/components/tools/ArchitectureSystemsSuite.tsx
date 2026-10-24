import React, { useState, useMemo } from 'react';
import { Copy, Check, Clock, ShieldCheck, Key, Layers, Activity } from 'lucide-react';

// ==========================================
// 1. SLA UPTIME & DOWNTIME CALCULATOR
// ==========================================
export const SlaUptimeCalculatorTool: React.FC = () => {
  const [slaPercent, setSlaPercent] = useState<number>(99.9);

  const downtime = useMemo(() => {
    const p = Math.min(100, Math.max(0, slaPercent));
    const downtimeFraction = (100 - p) / 100;

    // Durations in seconds
    const yearlySec = 365.25 * 24 * 3600 * downtimeFraction;
    const monthlySec = (365.25 / 12) * 24 * 3600 * downtimeFraction;
    const weeklySec = 7 * 24 * 3600 * downtimeFraction;
    const dailySec = 24 * 3600 * downtimeFraction;

    function formatTime(sec: number): string {
      if (sec < 60) return `${sec.toFixed(1)}s`;
      if (sec < 3600) {
        const m = Math.floor(sec / 60);
        const s = (sec % 60).toFixed(0);
        return `${m}m ${s}s`;
      }
      if (sec < 86400) {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        return `${h}h ${m}m`;
      }
      const d = Math.floor(sec / 86400);
      const h = Math.floor((sec % 86400) / 3600);
      return `${d}d ${h}h`;
    }

    return {
      daily: formatTime(dailySec),
      weekly: formatTime(weeklySec),
      monthly: formatTime(monthlySec),
      yearly: formatTime(yearlySec),
    };
  }, [slaPercent]);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-white">SLA Uptime & Downtime Allowance Calculator</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Calculate allowable system downtime per day, week, month, and year</p>
      </div>

      <div className="space-y-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Service Level Agreement (SLA %)</label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                step="0.001"
                min="90"
                max="100"
                value={slaPercent}
                onChange={(e) => setSlaPercent(Number(e.target.value))}
                className="w-32 px-3 py-1.5 text-base font-bold font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white tabular-nums"
              />
              <span className="text-base font-bold text-slate-600 dark:text-slate-400">%</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {[99, 99.9, 99.95, 99.99, 99.999].map((val) => (
              <button
                key={val}
                onClick={() => setSlaPercent(val)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                  slaPercent === val
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {val}%
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Daily Allowance</span>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">{downtime.daily}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Weekly Allowance</span>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">{downtime.weekly}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Monthly Allowance</span>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 tabular-nums">{downtime.monthly}</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Yearly Allowance</span>
            <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1 tabular-nums">{downtime.yearly}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. TOTP 2FA SECRET & URI GENERATOR
// ==========================================
export const TotpQrUriGeneratorTool: React.FC = () => {
  const [issuer, setIssuer] = useState('PocketKit');
  const [account, setAccount] = useState('user@example.com');
  const [secret, setSecret] = useState('JBSWY3DPEHPK3PXP');
  const [copied, setCopied] = useState(false);

  const generateRandomSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let res = '';
    for (let i = 0; i < 16; i++) {
      res += chars[Math.floor(Math.random() * chars.length)];
    }
    setSecret(res);
  };

  const otpAuthUri = useMemo(() => {
    return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
  }, [issuer, account, secret]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">TOTP 2FA Secret Key & otpauth:// URI Generator</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Create compatible 2FA authenticator URIs for Google Authenticator & 1Password</p>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(otpAuthUri);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy otpauth:// URI'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Issuer / App Name</label>
            <input
              type="text"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">User / Account Email</label>
            <input
              type="text"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Base32 Secret Key</label>
              <button
                onClick={generateRandomSecret}
                className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Generate New
              </button>
            </div>
            <input
              type="text"
              value={secret}
              onChange={(e) => setSecret(e.target.value.toUpperCase())}
              className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono tracking-widest"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">otpauth:// URI Output</label>
          <pre className="p-4 rounded-xl bg-slate-900 text-cyan-300 font-mono text-xs overflow-x-auto min-h-[140px] border border-slate-800 break-all whitespace-pre-wrap leading-relaxed">
            {otpAuthUri}
          </pre>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. GENERIC ARCHITECTURE SYSTEMS SUITE RUNNER
// ==========================================
interface ArchitectureSystemsSuiteProps {
  toolId?: string;
}

export const ArchitectureSystemsSuite: React.FC<ArchitectureSystemsSuiteProps> = ({ toolId }) => {
  switch (toolId) {
    case 'uptime-sla-downtime-calc':
      return <SlaUptimeCalculatorTool />;
    case 'totp-qr-uri-generator':
      return <TotpQrUriGeneratorTool />;
    default:
      return <SlaUptimeCalculatorTool />;
  }
};
