import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { router } from "expo-router";
import { store } from "../store";
import { clearToken } from "../store/slices/authSlice";
import { decryptApiPayload } from "../utils/decryption";
import { encryptPayload } from "../utils/encryption";

// Get the correct localhost URL based on platform
// For physical devices, uncomment and use your computer's IP address:
// export const getLocalApiUrl = () => "http://192.168.1.100:8000";



// Base API configuration
export const API_BASE_URL = "https://enyayasarathi.jk.gov.in/enyayasarathi"; // Replace with actual API URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Prevent multiple simultaneous session-timeout alerts when many requests get 403
let isSessionTimeoutAlertVisible = false;

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

          // Log final payload being sent
          console.log(
            "📤 Final payload being sent:",
            JSON.stringify(config.data, null, 2)
          );
          console.log("📤 Encrypted string format check:", {
            hasEncrypted: !!config.data.encrypted,
            encryptedType: typeof config.data.encrypted,
            encryptedLength: config.data.encrypted?.length,
            hasColon: config.data.encrypted?.includes(":"),
            firstPart: config.data.encrypted?.split(":")[0]?.substring(0, 20),
          });
          console.log("📤 Request headers:", {
            "Content-Type": config.headers["Content-Type"],
            "X-Encrypted": config.headers["X-Encrypted"],
            Authorization: config.headers["Authorization"]
              ? "Present"
              : "Not present",
          });
          console.log(
            "📤 Full URL:",
            `${config.baseURL || ""}${config.url || ""}`
          );
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

// Response interceptor for decryption + error handling
api.interceptors.response.use(
  (response) => {
    try {
      const endpoint = response.config?.url || "";
      const payload = response.data;

      // Skip decryption for district endpoints (these return plain arrays)
      const isDistrictEndpoint =
        endpoint.includes("/districts") ||
        endpoint.includes("districts-by-state");
      console.log("🔒 Encrypted response detected from:", endpoint);
      console.log(
        "🔒 Encrypted payload preview:",
        JSON.stringify(payload).substring(0, 200)
      );

      // Attempt to decrypt if payload has iv + data and endpoint is not a district endpoint
      if (!isDistrictEndpoint && payload && payload.iv && payload.data) {
        response.data = decryptApiPayload(payload);
      }
    } catch (err) {
      console.warn("⚠️ Response decryption skipped due to error:", err);
    }
    return response;
  },
  (error) => {
    try {
      const status = error?.response?.status;
      const url = error?.config?.url as string | undefined;
      const hasAuthHeader = !!error?.config?.headers?.Authorization;
      console.log("ERR:", error?.message, status, url);

      // Global session timeout handling:
      // - Trigger only for authenticated requests (with Authorization header)
      // - Ignore page hits endpoint
      // - Show alert only once even if multiple requests fail with 403
      if (
        status === 401 &&
        hasAuthHeader &&
        url &&
        !url.includes("/api/page-hits") &&
        !isSessionTimeoutAlertVisible
      ) {
        isSessionTimeoutAlertVisible = true;

        Alert.alert(
          "Session Timeout",
          "Your session has expired. Please log in again.",
          [
            {
              text: "Login",
              onPress: async () => {
                try {
                  await SecureStore.deleteItemAsync("auth_token");
                } catch (tokenError) {
                  console.log("Error clearing token on session timeout:", tokenError);
                }

                // Clear Redux auth state
                store.dispatch(clearToken());

                // Navigate to login screen
                try {
                  router.replace("/(auth)/login");
                } catch (navError) {
                  console.log("Error navigating to login after session timeout:", navError);
                } finally {
                  // Allow future session-timeout alerts after handling this one
                  isSessionTimeoutAlertVisible = false;
                }
              },
            },
          ],
          {
            cancelable: false,
          }
        );
      }
    } catch {}
    return Promise.reject(error);
  }
);

// Note: Legal Aid Services have been moved to src/services/legalAidApi.ts

export default api;
