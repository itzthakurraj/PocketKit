export interface ColorInfo {
  hex: string;
  r: number;
  g: number;
  b: number;
  a: number;
  h: number;
  s: number;
  l: number;
  rgbString: string;
  rgbaString: string;
  hslString: string;
  isLight: boolean;
}

export function parseHex(hexStr: string): { r: number; g: number; b: number; a: number } | null {
  let clean = hexStr.replace(/^#/, '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('') + 'FF';
  } else if (clean.length === 6) {
    clean += 'FF';
  } else if (clean.length !== 8) {
    return null;
  }

  const num = parseInt(clean, 16);
  if (isNaN(num)) return null;

  const r = (num >> 24) & 255;
  const g = (num >> 16) & 255;
  const b = (num >> 8) & 255;
  const a = Number(((num & 255) / 255).toFixed(2));

  return { r, g, b, a };
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.min(255, Math.max(0, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function getColorInfoFromRgb(r: number, g: number, b: number, a = 1): ColorInfo {
  const hex = rgbToHex(r, g, b);
  const { h, s, l } = rgbToHsl(r, g, b);
  const rgbString = `rgb(${r}, ${g}, ${b})`;
  const rgbaString = `rgba(${r}, ${g}, ${b}, ${a})`;
  const hslString = `hsl(${h}, ${s}%, ${l}%)`;
  // Perceived brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const isLight = brightness > 128;

  return {
    hex,
    r,
    g,
    b,
    a,
    h,
    s,
    l,
    rgbString,
    rgbaString,
    hslString,
    isLight,
  };
}

export function getColorHarmonies(hex: string): { complementary: string; analogous1: string; analogous2: string } {
  const rgb = parseHex(hex);
  if (!rgb) {
    return { complementary: '#10B981', analogous1: '#6366F1', analogous2: '#8B5CF6' };
  }
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const hslToHex = (h: number, s: number, l: number) => {
    h = (h % 360 + 360) % 360;
    const sNorm = s / 100;
    const lNorm = l / 100;
    const a = sNorm * Math.min(lNorm, 1 - lNorm);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = lNorm - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };

  return {
    complementary: hslToHex(hsl.h + 180, hsl.s, hsl.l),
    analogous1: hslToHex(hsl.h + 30, hsl.s, hsl.l),
    analogous2: hslToHex(hsl.h - 30, hsl.s, hsl.l),
  };
}
