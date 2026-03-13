import { encode, decode } from 'js-base64';

/**
 * base64加密
 */
export const encodeByBase64 = (str: string) => encode(str);

/**
 * base64解密
 */
export const decodeByBase64 = (str: string) => decode(str);
