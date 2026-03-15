import CryptoJS from 'crypto-js';
import { encode, decode } from 'js-base64';

const { VITE_CRYPTO_SECRET, VITE_CRYPTO_IV } = import.meta.env;

/**
 * 通用 AES 加密：支持对象/数组/字符串/数字/布尔/null
 * @param data 要加密的任意可序列化数据
 */
export const encryptAES = (data: any): string => {
  // 统一序列化：undefined 转 null，其他走 JSON.stringify
  const jsonStr = data === undefined ? 'null' : typeof data === 'string' ? data : JSON.stringify(data);

  return CryptoJS.AES.encrypt(jsonStr, CryptoJS.enc.Utf8.parse(VITE_CRYPTO_SECRET), {
    iv: CryptoJS.enc.Utf8.parse(VITE_CRYPTO_IV),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
};

/**
 * 通用 AES 解密：自动还原原始数据类型
 * @param ciphertext 加密后的字符串
 */
export const decryptAES = (ciphertext: string): any => {
  if (!ciphertext) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(VITE_CRYPTO_SECRET), {
      iv: CryptoJS.enc.Utf8.parse(VITE_CRYPTO_IV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedStr) return null;

    // 尝试解析为对象/数组，失败则返回原始字符串
    try {
      return JSON.parse(decryptedStr);
    } catch {
      return decryptedStr;
    }
  } catch (e) {
    console.error('解密失败:', e);
    return null;
  }
};

/**
 * base64加密
 */
export const encodeByBase64 = (str: string) => encode(str);

/**
 * base64解密
 */
export const decodeByBase64 = (str: string) => decode(str);
