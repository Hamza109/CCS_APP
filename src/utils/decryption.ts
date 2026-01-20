import CryptoJS from "crypto-js";
import Constants from "expo-constants";

/**
 * Derive the encryption key used for decrypting API responses.
 * The key is taken from app.config.js -> extra.encryptionKey.
 */
const getKeyString = (): string => {
  const key = Constants.expoConfig?.extra?.encryptionKey;
  if (!key) {
    console.warn(
      "⚠️ No encryption key found in extra.encryptionKey. Decryption will likely fail."
    );
    return "";
  }
  return key;
};

/**
 * Compute keys in both forms:
 * - Hashed (SHA256) to match Laravel hash logic
 * - Raw UTF-8 (32 chars) as a fallback if the backend uses the raw key
 */
const getKeys = (): {
  hashed: CryptoJS.lib.WordArray;
  raw?: CryptoJS.lib.WordArray;
} => {
  const keyString = getKeyString();
  const hashed = CryptoJS.SHA256(keyString);
  let raw: CryptoJS.lib.WordArray | undefined;
  if (keyString && keyString.length >= 16) {
    raw = CryptoJS.enc.Utf8.parse(keyString);
  }
  return { hashed, raw };
};

/**
 * Decrypt encrypted API payloads (format: { iv, data } both base64).
 * If the payload is not encrypted, returns it as-is.
 */
export function decryptApiPayload<T = any>(payload: any): T {
  if (!payload || !payload.iv || !payload.data) {
    return payload as T;
  }

  try {
    const iv = CryptoJS.enc.Base64.parse(payload.iv);
    const ciphertext = CryptoJS.enc.Base64.parse(payload.data);
    const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext });
    const { hashed, raw } = getKeys();

    // Try hashed key first
    const attemptDecrypt = (key: CryptoJS.lib.WordArray, label: string) => {
      const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      const json = decrypted.toString(CryptoJS.enc.Utf8);
      if (!json) {
        throw new Error(`${label} produced empty plaintext`);
      }
      return json;
    };

    let json: string | undefined;
    try {
      json = attemptDecrypt(hashed, "hashed key");
    } catch (e) {
      console.warn(
        "⚠️ Decrypt with hashed key failed, trying raw key if available:",
        e
      );
      if (raw) {
        json = attemptDecrypt(raw, "raw key");
      }
    }

    if (!json) {
      throw new Error("No valid plaintext after decryption attempts");
    }

    const parsed = JSON.parse(json);
    return parsed as T;
  } catch (error) {
    console.error("❌ Failed to decrypt API response:", error);
    return payload as T;
  }
}
