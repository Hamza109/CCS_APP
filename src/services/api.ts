import axios from "axios";
import { Platform } from "react-native";

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

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Debug: log outgoing request
    try {
      const fullUrl = `${config.baseURL || ""}${config.url || ""}`;
      console.log("REQ:", fullUrl, config.method);
    } catch {}
    // Add auth token if available
    const token = ""; // Get from secure storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
