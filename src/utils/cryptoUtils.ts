import CryptoJS from 'crypto-js';

export function encryptAES(text: string, secretKey: string): string {
  if (!text || !secretKey) return '';
  return CryptoJS.AES.encrypt(text, secretKey).toString();
}

export function decryptAES(ciphertext: string, secretKey: string): { success: boolean; result: string; error?: string } {
  if (!ciphertext || !secretKey) return { success: false, result: '' };
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText && ciphertext.length > 0) {
      return { success: false, result: '', error: 'Decryption failed: Incorrect secret key or corrupted ciphertext' };
    }
    return { success: true, result: originalText };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Invalid ciphertext or key';
    return { success: false, result: '', error: errorMsg };
  }
}

export function encryptDES(text: string, secretKey: string): string {
  if (!text || !secretKey) return '';
  return CryptoJS.DES.encrypt(text, secretKey).toString();
}

export function decryptDES(ciphertext: string, secretKey: string): { success: boolean; result: string; error?: string } {
  if (!ciphertext || !secretKey) return { success: false, result: '' };
  try {
    const bytes = CryptoJS.DES.decrypt(ciphertext, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText && ciphertext.length > 0) {
      return { success: false, result: '', error: 'Decryption failed: Incorrect key or corrupted ciphertext' };
    }
    return { success: true, result: originalText };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Invalid ciphertext or key';
    return { success: false, result: '', error: errorMsg };
  }
}

export function computeMD5(text: string): string {
  if (!text) return '';
  return CryptoJS.MD5(text).toString();
}

export function computeSHA256(text: string): string {
  if (!text) return '';
  return CryptoJS.SHA256(text).toString();
}

export function computeSHA512(text: string): string {
  if (!text) return '';
  return CryptoJS.SHA512(text).toString();
}

export function encodeBase64(text: string): string {
  try {
    const utf8Bytes = CryptoJS.enc.Utf8.parse(text);
    return CryptoJS.enc.Base64.stringify(utf8Bytes);
  } catch {
    return btoa(unescape(encodeURIComponent(text)));
  }
}

export function decodeBase64(base64Str: string): { success: boolean; result: string; error?: string } {
  try {
    const words = CryptoJS.enc.Base64.parse(base64Str);
    const text = CryptoJS.enc.Utf8.stringify(words);
    return { success: true, result: text };
  } catch (err: unknown) {
    try {
      const fallback = decodeURIComponent(escape(atob(base64Str)));
      return { success: true, result: fallback };
    } catch {
      return { success: false, result: '', error: 'Invalid Base64 input string' };
    }
  }
}

export function encodeUrl(text: string, component = true): string {
  return component ? encodeURIComponent(text) : encodeURI(text);
}

export function decodeUrl(text: string, component = true): string {
  try {
    return component ? decodeURIComponent(text) : decodeURI(text);
  } catch {
    return text;
  }
}

export function encodeHtmlEntities(text: string): string {
  return text.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#039;';
      default: return m;
    }
  });
}

export function decodeHtmlEntities(text: string): string {
  const doc = new DOMParser().parseFromString(text, 'text/html');
  return doc.documentElement.textContent || '';
}

export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean;
}

export function generatePassword(options: PasswordOptions): { password: string; entropy: number; strength: 'Weak' | 'Medium' | 'Strong' | 'Very Strong' } {
  let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let lowercase = 'abcdefghijklmnopqrstuvwxyz';
  let numbers = '0123456789';
  let symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (options.excludeAmbiguous) {
    uppercase = uppercase.replace(/[IO]/g, '');
    lowercase = lowercase.replace(/[lo]/g, '');
    numbers = numbers.replace(/[01]/g, '');
    symbols = symbols.replace(/[|`'"]/g, '');
  }

  let charset = '';
  const guaranteed: string[] = [];

  if (options.includeUppercase) {
    charset += uppercase;
    guaranteed.push(uppercase[Math.floor(Math.random() * uppercase.length)]);
  }
  if (options.includeLowercase) {
    charset += lowercase;
    guaranteed.push(lowercase[Math.floor(Math.random() * lowercase.length)]);
  }
  if (options.includeNumbers) {
    charset += numbers;
    guaranteed.push(numbers[Math.floor(Math.random() * numbers.length)]);
  }
  if (options.includeSymbols) {
    charset += symbols;
    guaranteed.push(symbols[Math.floor(Math.random() * symbols.length)]);
  }

  if (!charset) {
    charset = lowercase + numbers;
  }

  const result: string[] = [...guaranteed];
  for (let i = result.length; i < options.length; i++) {
    result.push(charset[Math.floor(Math.random() * charset.length)]);
  }

  // Shuffle
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  const password = result.join('');
  const poolSize = charset.length;
  const entropy = Math.round(options.length * Math.log2(poolSize || 1));

  let strength: 'Weak' | 'Medium' | 'Strong' | 'Very Strong' = 'Weak';
  if (entropy > 75) strength = 'Very Strong';
  else if (entropy > 50) strength = 'Strong';
  else if (entropy > 35) strength = 'Medium';

  return { password, entropy, strength };
}
