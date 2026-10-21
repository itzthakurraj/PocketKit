/**
 * Utility functions for ASCII, binary, and text conversions.
 */

export function textToAscii(
  input: string,
  delimiter = ' ',
  format: 'dec' | 'bin' | 'hex' = 'dec'
): string {
  if (!input) return '';
  const result: string[] = [];

  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    if (format === 'bin') {
      result.push(code.toString(2).padStart(8, '0'));
    } else if (format === 'hex') {
      result.push(code.toString(16).toUpperCase().padStart(2, '0'));
    } else {
      result.push(code.toString(10));
    }
  }

  return result.join(delimiter);
}

export function asciiToText(
  input: string,
  delimiter = ' ',
  format: 'dec' | 'bin' | 'hex' = 'dec'
): string {
  if (!input) return '';
  const clean = input.trim();
  const tokens = delimiter ? clean.split(delimiter).filter(Boolean) : [clean];
  const chars: string[] = [];

  for (const token of tokens) {
    let charCode: number;
    if (format === 'bin') {
      charCode = parseInt(token, 2);
    } else if (format === 'hex') {
      charCode = parseInt(token, 16);
    } else {
      charCode = parseInt(token, 10);
    }

    if (!isNaN(charCode)) {
      chars.push(String.fromCharCode(charCode));
    }
  }

  return chars.join('');
}
