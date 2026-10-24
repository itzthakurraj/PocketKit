import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Percent,
  Hash,
  Activity,
  Layers,
  ArrowRightLeft,
  CircleDot,
  DollarSign,
  Scale,
} from 'lucide-react';

// ==========================================
// 1. MATRIX CALCULATOR (2x2 & 3x3)
// ==========================================
export const MatrixCalculatorTool: React.FC = () => {
  const [size, setSize] = useState<2 | 3>(2);
  const [matA, setMatA] = useState<number[][]>([[1, 2], [3, 4]]);
  const [matB, setMatB] = useState<number[][]>([[5, 6], [7, 8]]);
  const [operation, setOperation] = useState<'add' | 'sub' | 'mul' | 'detA'>('add');
  const [copied, setCopied] = useState(false);

  const changeSize = (newSize: 2 | 3) => {
    setSize(newSize);
    if (newSize === 2) {
      setMatA([[1, 2], [3, 4]]);
      setMatB([[5, 6], [7, 8]]);
    } else {
      setMatA([[1, 2, 3], [0, 1, 4], [5, 6, 0]]);
      setMatB([[2, 0, -1], [1, 3, 2], [0, -2, 1]]);
    }
  };

  const result = useMemo(() => {
    if (operation === 'add') {
      return matA.map((row, r) => row.map((val, c) => val + (matB[r]?.[c] ?? 0)));
    }
    if (operation === 'sub') {
      return matA.map((row, r) => row.map((val, c) => val - (matB[r]?.[c] ?? 0)));
    }
    if (operation === 'mul') {
      const res: number[][] = Array(size).fill(0).map(() => Array(size).fill(0));
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          let sum = 0;
          for (let k = 0; k < size; k++) {
            sum += matA[r][k] * matB[k][c];
          }
          res[r][c] = sum;
        }
      }
      return res;
    }
    if (operation === 'detA') {
      if (size === 2) {
        return matA[0][0] * matA[1][1] - matA[0][1] * matA[1][0];
      }
      // 3x3 determinant
      const a = matA[0][0], b = matA[0][1], c = matA[0][2];
      const d = matA[1][0], e = matA[1][1], f = matA[1][2];
      const g = matA[2][0], h = matA[2][1], i = matA[2][2];
      return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
    }
    return null;
  }, [matA, matB, operation, size]);

  const updateCell = (matrix: 'A' | 'B', r: number, c: number, val: number) => {
    if (matrix === 'A') {
      const next = matA.map(row => [...row]);
      next[r][c] = val;
      setMatA(next);
    } else {
      const next = matB.map(row => [...row]);
      next[r][c] = val;
      setMatB(next);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Matrix Calculator (2x2 / 3x3)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeSize(size === 2 ? 3 : 2)}
            className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border rounded-lg"
          >
            Switch to {size === 2 ? '3x3' : '2x2'}
          </button>
          <div className="flex rounded-lg border overflow-hidden text-xs">
            {(['add', 'sub', 'mul', 'detA'] as const).map(op => (
              <button
                key={op}
                onClick={() => setOperation(op)}
                className={`px-3 py-1.5 font-medium ${operation === op ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800'}`}
              >
                {op === 'add' ? 'A + B' : op === 'sub' ? 'A - B' : op === 'mul' ? 'A × B' : 'det(A)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Matrix A</label>
          <div className={`grid gap-2 ${size === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {matA.map((row, r) =>
              row.map((val, c) => (
                <input
                  key={`a-${r}-${c}`}
                  type="number"
                  value={val}
                  onChange={(e) => updateCell('A', r, c, Number(e.target.value))}
                  className="p-3 text-center font-mono font-bold text-sm bg-white dark:bg-slate-900 border rounded-xl"
                />
              ))
            )}
          </div>
        </div>

        {operation !== 'detA' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Matrix B</label>
            <div className={`grid gap-2 ${size === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {matB.map((row, r) =>
                row.map((val, c) => (
                  <input
                    key={`b-${r}-${c}`}
                    type="number"
                    value={val}
                    onChange={(e) => updateCell('B', r, c, Number(e.target.value))}
                    className="p-3 text-center font-mono font-bold text-sm bg-white dark:bg-slate-900 border rounded-xl"
                  />
                ))
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-2">Computed Result</label>
          {typeof result === 'number' ? (
            <div className="p-8 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl text-center">
              <span className="text-xs text-indigo-500 font-semibold block">Determinant |A|</span>
              <span className="text-4xl font-mono font-extrabold text-indigo-700 dark:text-indigo-300">{result}</span>
            </div>
          ) : Array.isArray(result) ? (
            <div className={`grid gap-2 ${size === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {result.map((row, r) =>
                row.map((val, c) => (
                  <div key={`res-${r}-${c}`} className="p-3 text-center font-mono font-extrabold text-sm bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-xl">
                    {val}
                  </div>
                ))
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. FRACTION SIMPLIFIER & STEP CALCULATOR
// ==========================================
export const FractionSimplifierTool: React.FC = () => {
  const [numerator, setNumerator] = useState<number>(42);
  const [denominator, setDenominator] = useState<number>(56);

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

  const simplified = useMemo(() => {
    if (denominator === 0) return { error: 'Denominator cannot be zero.' };
    const div = Math.abs(gcd(numerator, denominator));
    const num = numerator / div;
    const den = denominator / div;
    const mixedWhole = Math.floor(Math.abs(num) / Math.abs(den));
    const mixedRemainder = Math.abs(num) % Math.abs(den);
    const decimal = (numerator / denominator).toFixed(4);

    return {
      num,
      den,
      gcd: div,
      decimal,
      mixed: mixedWhole > 0 && mixedRemainder > 0 ? `${num < 0 ? '-' : ''}${mixedWhole} ${mixedRemainder}/${den}` : null,
    };
  }, [numerator, denominator]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Fraction Simplifier & Mixed Number Reducer</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Numerator (Top)</label>
            <input
              type="number"
              value={numerator}
              onChange={(e) => setNumerator(Number(e.target.value))}
              className="w-full p-2.5 font-mono text-base border rounded-xl dark:bg-slate-800"
            />
          </div>
          <div className="h-0.5 bg-slate-300 dark:bg-slate-700 w-full" />
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Denominator (Bottom)</label>
            <input
              type="number"
              value={denominator}
              onChange={(e) => setDenominator(Number(e.target.value))}
              className="w-full p-2.5 font-mono text-base border rounded-xl dark:bg-slate-800"
            />
          </div>
        </div>

        <div className="p-6 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800 text-center space-y-3">
          <span className="text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400">Simplified Fraction</span>
          <div className="text-4xl font-mono font-extrabold text-indigo-900 dark:text-indigo-100">
            {simplified.num} / {simplified.den}
          </div>
          {simplified.mixed && (
            <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Mixed Number: <span className="font-mono text-indigo-600 dark:text-indigo-400">{simplified.mixed}</span>
            </div>
          )}
          <div className="text-xs text-slate-500">
            Decimal: <span className="font-mono font-bold">{simplified.decimal}</span> (Divided by GCD: {simplified.gcd})
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. QUADRATIC EQUATION SOLVER
// ==========================================
export const QuadraticEquationSolverTool: React.FC = () => {
  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(-5);
  const [c, setC] = useState<number>(6);

  const solution = useMemo(() => {
    if (a === 0) return { error: 'Not a quadratic equation (a cannot be 0).' };
    const delta = b * b - 4 * a * c;
    const vertexX = -b / (2 * a);
    const vertexY = c - (b * b) / (4 * a);

    if (delta > 0) {
      const x1 = (-b + Math.sqrt(delta)) / (2 * a);
      const x2 = (-b - Math.sqrt(delta)) / (2 * a);
      return { delta, type: 'Two Real Roots', x1: x1.toFixed(4), x2: x2.toFixed(4), vertexX, vertexY };
    } else if (delta === 0) {
      const x = -b / (2 * a);
      return { delta, type: 'One Real Double Root', x1: x.toFixed(4), x2: x.toFixed(4), vertexX, vertexY };
    } else {
      const real = (-b / (2 * a)).toFixed(4);
      const imag = (Math.sqrt(-delta) / (2 * a)).toFixed(4);
      return {
        delta,
        type: 'Two Complex Roots',
        x1: `${real} + ${imag}i`,
        x2: `${real} - ${imag}i`,
        vertexX,
        vertexY,
      };
    }
  }, [a, b, c]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Quadratic Equation Solver (ax² + bx + c = 0)</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-slate-500">Coefficient a</label>
          <input type="number" value={a} onChange={(e) => setA(Number(e.target.value))} className="w-full p-2.5 font-mono text-center text-sm border rounded-xl dark:bg-slate-900" />
        </div>
        <div>
          <label className="text-xs text-slate-500">Coefficient b</label>
          <input type="number" value={b} onChange={(e) => setB(Number(e.target.value))} className="w-full p-2.5 font-mono text-center text-sm border rounded-xl dark:bg-slate-900" />
        </div>
        <div>
          <label className="text-xs text-slate-500">Coefficient c</label>
          <input type="number" value={c} onChange={(e) => setC(Number(e.target.value))} className="w-full p-2.5 font-mono text-center text-sm border rounded-xl dark:bg-slate-900" />
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-bold text-sm text-slate-800 dark:text-slate-200">Discriminant Δ = b² - 4ac</span>
          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{solution.delta}</span>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
          <div className="text-xs text-slate-500 font-semibold">{solution.type}</div>
          <div className="grid grid-cols-2 gap-4 font-mono text-base font-extrabold text-indigo-600 dark:text-indigo-400">
            <div>x₁ = {solution.x1}</div>
            <div>x₂ = {solution.x2}</div>
          </div>
          <div className="text-xs text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
            Parabola Vertex: ({solution.vertexX?.toFixed(2)}, {solution.vertexY?.toFixed(2)})
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. STATISTICS & STANDARD DEVIATION
// ==========================================
export const StatisticsStdDevTool: React.FC = () => {
  const [dataInput, setDataInput] = useState<string>('12, 15, 18, 22, 25, 28, 30, 32, 45, 50');

  const stats = useMemo(() => {
    const nums = dataInput
      .split(/[\s,]+/)
      .map(n => parseFloat(n.trim()))
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b);

    if (nums.length === 0) return null;

    const count = nums.length;
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / count;

    const median = count % 2 === 0
      ? (nums[count / 2 - 1] + nums[count / 2]) / 2
      : nums[Math.floor(count / 2)];

    const variance = nums.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (count > 1 ? count - 1 : 1);
    const stdDev = Math.sqrt(variance);
    const min = nums[0];
    const max = nums[count - 1];
    const range = max - min;

    return { count, sum, mean: mean.toFixed(2), median, variance: variance.toFixed(2), stdDev: stdDev.toFixed(2), min, max, range };
  }, [dataInput]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Statistics, Variance & Standard Deviation</span>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">Dataset (Comma or Space Separated)</label>
        <textarea
          value={dataInput}
          onChange={(e) => setDataInput(e.target.value)}
          rows={3}
          className="w-full p-2.5 font-mono text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
        />
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Sample Count (N)', val: stats.count },
            { label: 'Mean (Average)', val: stats.mean },
            { label: 'Median', val: stats.median },
            { label: 'Standard Deviation (σ)', val: stats.stdDev },
            { label: 'Variance (s²)', val: stats.variance },
            { label: 'Min / Max', val: `${stats.min} / ${stats.max}` },
            { label: 'Range', val: stats.range },
            { label: 'Sum Total', val: stats.sum },
          ].map((item, i) => (
            <div key={i} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-400 block">{item.label}</span>
              <span className="text-base font-mono font-bold text-slate-800 dark:text-slate-200">{item.val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. OHM'S LAW & ELECTRICAL POWER CALCULATOR
// ==========================================
export const OhmsLawCalculatorTool: React.FC = () => {
  const [voltage, setVoltage] = useState<number>(12);
  const [current, setCurrent] = useState<number>(2);

  const resistance = current > 0 ? (voltage / current).toFixed(2) : '0';
  const power = (voltage * current).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Ohm's Law & Electrical Power</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-slate-600 block mb-1">Voltage (V) in Volts</label>
          <input
            type="number"
            value={voltage}
            onChange={(e) => setVoltage(Number(e.target.value))}
            className="w-full p-2.5 font-mono text-sm border rounded-xl dark:bg-slate-900"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600 block mb-1">Current (I) in Amperes</label>
          <input
            type="number"
            value={current}
            onChange={(e) => setCurrent(Number(e.target.value))}
            className="w-full p-2.5 font-mono text-sm border rounded-xl dark:bg-slate-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 text-center">
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">Resistance (R = V/I)</span>
          <div className="text-2xl font-mono font-extrabold text-indigo-900 dark:text-indigo-100 mt-1">
            {resistance} Ω
          </div>
        </div>
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-center">
          <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">Power (P = V × I)</span>
          <div className="text-2xl font-mono font-extrabold text-amber-900 dark:text-amber-100 mt-1">
            {power} W
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. MULTI-BASE RADIX CONVERTER
// ==========================================
export const MultiBaseRadixConverterTool: React.FC = () => {
  const [decVal, setDecVal] = useState<number>(255);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Hash className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Multi-Base Radix Number System Converter</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
        <div className="p-3 bg-white dark:bg-slate-900 border rounded-xl space-y-1">
          <label className="text-[10px] text-slate-400">Decimal (Base 10)</label>
          <input
            type="number"
            value={decVal}
            onChange={(e) => setDecVal(Number(e.target.value))}
            className="w-full p-2 border rounded dark:bg-slate-800 font-bold text-sm"
          />
        </div>
        <div className="p-3 bg-white dark:bg-slate-900 border rounded-xl space-y-1">
          <label className="text-[10px] text-slate-400">Binary (Base 2)</label>
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded font-bold text-indigo-600 dark:text-indigo-400 select-all">
            {decVal.toString(2)}
          </div>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900 border rounded-xl space-y-1">
          <label className="text-[10px] text-slate-400">Hexadecimal (Base 16)</label>
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded font-bold text-indigo-600 dark:text-indigo-400 select-all uppercase">
            0x{decVal.toString(16)}
          </div>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900 border rounded-xl space-y-1">
          <label className="text-[10px] text-slate-400">Octal (Base 8)</label>
          <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded font-bold text-indigo-600 dark:text-indigo-400 select-all">
            0o{decVal.toString(8)}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. CRYPTO & INVESTMENT P&L CALCULATOR
// ==========================================
export const CryptoProfitLossTool: React.FC = () => {
  const [buyPrice, setBuyPrice] = useState<number>(30000);
  const [sellPrice, setSellPrice] = useState<number>(45000);
  const [quantity, setQuantity] = useState<number>(0.5);

  const totalCost = buyPrice * quantity;
  const totalReturn = sellPrice * quantity;
  const profit = totalReturn - totalCost;
  const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Crypto & Stock Profit / Loss ROI Calculator</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-slate-500">Buy Price ($)</label>
          <input type="number" value={buyPrice} onChange={(e) => setBuyPrice(Number(e.target.value))} className="w-full p-2.5 font-mono text-sm border rounded-xl dark:bg-slate-900" />
        </div>
        <div>
          <label className="text-xs text-slate-500">Sell Price ($)</label>
          <input type="number" value={sellPrice} onChange={(e) => setSellPrice(Number(e.target.value))} className="w-full p-2.5 font-mono text-sm border rounded-xl dark:bg-slate-900" />
        </div>
        <div>
          <label className="text-xs text-slate-500">Coin Quantity</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full p-2.5 font-mono text-sm border rounded-xl dark:bg-slate-900" />
        </div>
      </div>

      <div className={`p-6 rounded-2xl border ${profit >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300' : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300'}`}>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-300">Total Net Return</span>
          <span className={`text-3xl font-mono font-extrabold ${profit >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
            {profit >= 0 ? '+' : ''}${profit.toFixed(2)} ({roi >= 0 ? '+' : ''}{roi.toFixed(2)}%)
          </span>
        </div>
      </div>
    </div>
  );
};
