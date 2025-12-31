import CryptoJS from "crypto-js";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

// Encryption key storage key
const ENCRYPTION_KEY_STORAGE_KEY = "app_encryption_key";

// Get encryption key from environment variables (via app.config.js)
// Falls back to a default if not set (should never happen in production)
const getEncryptionKeyFromEnv = (): string => {
  const key = Constants.expoConfig?.extra?.encryptionKey;

  if (!key || key === "your-32-character-secret-key-here") {
    console.warn(
      "Encryption key not found in environment variables. Using fallback key. " +
        "Please set ENCRYPTION_KEY in .env file and ensure app.config.js is configured."
    );
    return "your-32-character-secret-key-here"; // Fallback
  }

  // Ensure key is exactly 32 characters for AES-256
  if (key.length !== 32) {
    console.warn(
      `Encryption key length is ${key.length}, expected 32 characters. ` +
        "Using first 32 characters or padding as needed."
    );
    return key.substring(0, 32).padEnd(32, "0");
  }

  return key;
};

// Initialize and log encryption key at module load (after function declaration)
if (typeof window !== "undefined" || typeof global !== "undefined") {
  // Use setTimeout to ensure this runs after module initialization
  setTimeout(() => {
    try {
      const envKey = getEncryptionKeyFromEnv();
      if (envKey && envKey !== "your-32-character-secret-key-here") {
        const maskedKey = `${envKey.substring(0, 4)}...${envKey.substring(
          envKey.length - 4
        )}`;
        console.log("🔑 [STARTUP] Encryption key loaded from .env");
        console.log("🔑 [STARTUP] Key (masked):", maskedKey);
        console.log("🔑 [STARTUP] Key length:", envKey.length);
      } else {
        console.warn(
          "⚠️ [STARTUP] Encryption key not found in .env - using fallback!"
        );
        console.warn("⚠️ [STARTUP] Please set ENCRYPTION_KEY in .env file");
      }
    } catch (error) {
      console.error("❌ [STARTUP] Error loading encryption key:", error);
    }
  }, 100);
}

/**
 * Get encryption key from environment or secure storage
 * The key should be 32 characters (256 bits) for AES-256
 * Priority: Environment variable > Secure storage > Fallback
 */
async function getEncryptionKey(): Promise<string> {
  try {
    // First, try to get key from environment variables (via app.config.js)
    const envKey = getEncryptionKeyFromEnv();

    // Log the key source and value (masked for security)
    const maskedKey = envKey
      ? `${envKey.substring(0, 4)}...${envKey.substring(envKey.length - 4)}`
      : "not found";
    console.log("🔑 Encryption Key Source: Environment");
    console.log("🔑 Encryption Key (masked):", maskedKey);
    console.log("🔑 Encryption Key Length:", envKey?.length || 0);

    // If we have a valid env key (not the fallback), use it
    if (envKey && envKey !== "your-32-character-secret-key-here") {
      // Store it in secure storage for faster access
      try {
        await SecureStore.setItemAsync(ENCRYPTION_KEY_STORAGE_KEY, envKey);
      } catch (error) {
        // Non-critical: continue even if storage fails
        console.warn(
          "Failed to store encryption key in secure storage:",
          error
        );
      }
      return envKey;
    }

    // Fallback: Try to get from secure storage
    const storedKey = await SecureStore.getItemAsync(
      ENCRYPTION_KEY_STORAGE_KEY
    );
    if (storedKey) {
      const maskedStoredKey = `${storedKey.substring(
        0,
        4
      )}...${storedKey.substring(storedKey.length - 4)}`;
      console.log("🔑 Encryption Key Source: Secure Storage");
      console.log("🔑 Encryption Key (masked):", maskedStoredKey);
      return storedKey;
    }

    // Last resort: use environment key (even if it's the fallback)
    console.warn(
      "⚠️ Using fallback encryption key - this should not happen in production!"
    );
    return envKey;
  } catch (error) {
    console.error("❌ Error getting encryption key:", error);
    // Final fallback
    return getEncryptionKeyFromEnv();
  }
}

/**
 * Set encryption key (useful for key rotation or fetching from backend)
 */
export async function setEncryptionKey(key: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(ENCRYPTION_KEY_STORAGE_KEY, key);
  } catch (error) {
    console.error("Error setting encryption key:", error);
    throw error;
  }
}

/**
 * Generate a random IV (Initialization Vector) using a fallback method
 * This avoids issues with native crypto module
 */
function generateIV(): CryptoJS.lib.WordArray {
  try {
    // Try the standard method first
    const iv = CryptoJS.lib.WordArray.random(16);
    if (iv && iv.sigBytes === 16) {
      return iv;
    }
    throw new Error("Invalid IV from random()");
  } catch (error) {
    console.warn("⚠️ Native random failed, using fallback method:", error);
    // Fallback: Generate random bytes using Math.random and create WordArray manually
    const randomBytes: number[] = [];
    for (let i = 0; i < 16; i++) {
      randomBytes.push(Math.floor(Math.random() * 256));
    }

    // Convert bytes to words (4 bytes per word, 4 words for 16 bytes)
    const words: number[] = [];
    for (let i = 0; i < 4; i++) {
      const word =
        (randomBytes[i * 4] << 24) |
        (randomBytes[i * 4 + 1] << 16) |
        (randomBytes[i * 4 + 2] << 8) |
        randomBytes[i * 4 + 3];
      words.push(word >>> 0); // Ensure unsigned 32-bit
    }

    const iv = CryptoJS.lib.WordArray.create(words, 16);
    console.log("✅ Fallback IV generated successfully");
    return iv;
  }
}

/**
 * Encrypt data using AES-256-CBC
 * @param data - Data to encrypt (object or string)
 * @returns Encrypted string in format: iv:encryptedData
 */
export async function encryptData(data: any): Promise<string> {
  try {
    console.log("🔐 Starting encryption...");
    const key = await getEncryptionKey();

    if (!key || key.length !== 32) {
      throw new Error(
        `Invalid encryption key length: ${
          key?.length || 0
        }. Expected 32 characters.`
      );
    }

    // Convert data to string if it's an object
    const dataString = typeof data === "string" ? data : JSON.stringify(data);
    console.log(
      "📦 Original payload:",
      dataString.substring(0, 200) + (dataString.length > 200 ? "..." : "")
    );

    // Generate random IV (Initialization Vector) for each encryption
    let iv: CryptoJS.lib.WordArray;
    try {
      iv = generateIV();
      console.log("✅ IV generated successfully");
    } catch (ivError) {
      console.error("❌ Failed to generate IV:", ivError);
      throw new Error(`IV generation failed: ${ivError}`);
    }

    // Parse the key
    let parsedKey: CryptoJS.lib.WordArray;
    try {
      parsedKey = CryptoJS.enc.Utf8.parse(key);
      console.log("✅ Key parsed successfully");
    } catch (keyError) {
      console.error("❌ Failed to parse key:", keyError);
      throw new Error(`Key parsing failed: ${keyError}`);
    }

    // Encrypt using AES-256-CBC
    let encrypted: CryptoJS.lib.CipherParams;
    try {
      encrypted = CryptoJS.AES.encrypt(dataString, parsedKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      console.log("✅ Encryption successful");
    } catch (encryptError) {
      console.error("❌ Encryption failed:", encryptError);
      throw new Error(`AES encryption failed: ${encryptError}`);
    }

    // Combine IV and encrypted data
    // Format: iv:encryptedData (both base64 encoded)
    const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
    const encryptedBase64 = encrypted.toString();
    const result = `${ivBase64}:${encryptedBase64}`;

    console.log("🔐 Encrypted payload length:", result.length);
    console.log(
      "🔐 Encrypted payload preview:",
      result.substring(0, 100) + "..."
    );

    return result;
  } catch (error: any) {
    console.error("❌ Encryption error details:", {
      message: error?.message,
      stack: error?.stack,
      error: error,
    });
    throw new Error(
      `Failed to encrypt data: ${error?.message || "Unknown error"}`
    );
  }
}

/**
 * Decrypt data using AES-256-CBC
 * @param encryptedData - Encrypted string in format: iv:encryptedData
 * @returns Decrypted data (parsed as JSON if possible, otherwise string)
 */
export async function decryptData(encryptedData: string): Promise<any> {
  try {
    const key = await getEncryptionKey();

    // Split IV and encrypted data
    const parts = encryptedData.split(":");
    if (parts.length !== 2) {
      throw new Error("Invalid encrypted data format");
    }

    const [ivBase64, encryptedBase64] = parts;

    // Parse IV and encrypted data
    const iv = CryptoJS.enc.Base64.parse(ivBase64);
    const encrypted = CryptoJS.enc.Base64.parse(encryptedBase64);

    // Decrypt
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encrypted } as any,
      CryptoJS.enc.Utf8.parse(key),
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

    // Try to parse as JSON, otherwise return as string
    try {
      return JSON.parse(decryptedString);
    } catch {
      return decryptedString;
    }
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt data");
  }
}

/**
 * Check if data is encrypted (has the iv:encryptedData format)
 */
export function isEncrypted(data: string): boolean {
  return (
    typeof data === "string" &&
    data.includes(":") &&
    data.split(":").length === 2
  );
}

/**
 * Encrypt request payload for POST requests
 * This is the main function used by the API interceptor
 */
export async function encryptPayload(payload: any): Promise<string> {
  return encryptData(payload);
}
