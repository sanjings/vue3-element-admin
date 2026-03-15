import { encryptAES, decryptAES } from '@/utils/encryption';
import { safeStringify, safeParse } from '@/utils';
import { inProd } from '@/utils/env';

/**
 * 通用加密存储封装
 * @param storage
 */
const createSecureStorage = (storage: Storage) => ({
  setItem: (key: string, value: unknown) => {
    if (inProd) {
      storage.setItem(key, encryptAES(value));
    } else {
      storage.setItem(key, safeStringify(value));
    }
  },

  getItem: <T = unknown>(key: string, defaultValue: T | null = null): T | null => {
    const value = storage.getItem(key);
    if (!value) return defaultValue;

    if (inProd) {
      return (decryptAES(value) as T | null) ?? defaultValue;
    } else {
      return safeParse<T>(value, defaultValue);
    }
  },
  removeItem: (key: string) => storage.removeItem(key),
  clear: () => storage.clear()
});

export const secureLocalStorage = createSecureStorage(localStorage);
export const secureSessionStorage = createSecureStorage(sessionStorage);
