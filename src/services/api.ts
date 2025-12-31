import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { encryptPayload } from "../utils/encryption";

// Get the correct localhost URL based on platform
export const getLocalApiUrl = () => {
  if (Platform.OS === "android") {
    // Android emulator uses 10.0.2.2 to access host machine's localhost
    return "https://jayna-cynical-uninimically.ngrok-free.dev";
  } else if (Platform.OS === "ios") {
    // iOS simulator can use localhost
    return "http://127.0.0.1:8000";
  } else {
    // Web or other platforms
    return "http://192.168.1.4:8000";
  }
};

// For physical devices, uncomment and use your computer's IP address:
// export const getLocalApiUrl = () => "http://192.168.1.100:8000";

export const LOCAL_API_URL = getLocalApiUrl();

// Base API configuration
const API_BASE_URL = "https://api.ccs.gov.in"; // Replace with actual API URL

const api = axios.create({
  baseURL: LOCAL_API_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Log base URL once at startup for debugging preview builds
console.log("API base:", api.defaults.baseURL);

// Request interceptor for authentication and encryption
api.interceptors.request.use(
  async (config) => {
    // Debug: log outgoing request
    try {
      const fullUrl = `${config.baseURL || ""}${config.url || ""}`;
      console.log("REQ:", fullUrl, config.method);
    } catch {}

    // Add auth token if available
    const token = await SecureStore.getItemAsync("auth_token");
    console.log("token", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Encrypt POST request payloads
    if (config.method === "post" || config.method === "POST") {
      if (config.data && typeof config.data === "object") {
        try {
          const endpoint = config.url || "";
          console.log("📤 POST Request to:", endpoint);
          console.log(
            "📦 Original POST Payload:",
            JSON.stringify(config.data, null, 2)
          );

          // Encrypt the payload
          const encryptedPayload = await encryptPayload(config.data);

          // Replace data with encrypted string
          // Send as JSON with encrypted field
          config.data = {
            encrypted: encryptedPayload,
          };

          // Add header to indicate encrypted payload
          config.headers["X-Encrypted"] = "true";
          config.headers["Content-Type"] = "application/json";

          // Log encryption for debugging (including OTP endpoints)
          if (endpoint.includes("/otp/")) {
            console.log("✅ OTP API payload encrypted successfully:", endpoint);
          } else {
            console.log("✅ Payload encrypted for POST request:", endpoint);
          }
          console.log("📤 Sending encrypted payload to:", endpoint);
        } catch (error: any) {
          console.error("❌ Failed to encrypt payload:", {
            endpoint: config.url,
            error: error?.message,
            stack: error?.stack,
          });
          // Continue with unencrypted payload if encryption fails
          // You might want to throw an error here in production
          throw error; // Re-throw to prevent sending unencrypted data
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      const status = error?.response?.status;
      const url = error?.config?.url;
      console.log("ERR:", error?.message, status, url);
    } catch {}
    return Promise.reject(error);
  }
);

// Note: Legal Aid Services have been moved to src/services/legalAidApi.ts

export default api;
