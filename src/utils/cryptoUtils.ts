import CryptoJS from 'crypto-js';

/**
 * AES-256 and Triple-DES client-side encryption utilities.
 */

export function encryptAES(text: string, secretKey: string): string {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
}

export function decryptAES(
  ciphertext: string,
  secretKey: string
): { success: boolean; result: string; error?: string } {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) {
      return { success: false, result: '', error: 'Incorrect passphrase or corrupt ciphertext' };
    }
    return { success: true, result: originalText };
  } catch (err: any) {
    return { success: false, result: '', error: err.message || 'Decryption failed' };
  }
}

export function encryptDES(text: string, secretKey: string): string {
  return CryptoJS.TripleDES.encrypt(text, secretKey).toString();
}

export function decryptDES(
  ciphertext: string,
  secretKey: string
): { success: boolean; result: string; error?: string } {
  try {
    const bytes = CryptoJS.TripleDES.decrypt(ciphertext, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) {
      return { success: false, result: '', error: 'Incorrect passphrase or corrupt ciphertext' };
    }
    return { success: true, result: originalText };
  } catch (err: any) {
    return { success: false, result: '', error: err.message || 'Decryption failed' };
  }
}

export function encodeBase64(text: string): string {
  const words = CryptoJS.enc.Utf8.parse(text);
  return CryptoJS.enc.Base64.stringify(words);
}

export function decodeBase64(
  base64Str: string
): { success: boolean; result: string; error?: string } {
  try {
    const words = CryptoJS.enc.Base64.parse(base64Str);
    const text = CryptoJS.enc.Utf8.stringify(words);
    return { success: true, result: text };
  } catch (err: any) {
    return { success: false, result: '', error: err.message || 'Invalid Base64 string' };
  }
}
