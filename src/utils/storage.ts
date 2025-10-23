import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys
export const STORAGE_KEYS = {
  USER: "user",
  THEME: "theme",
  LANGUAGE: "language",
  CACHED_ACTS: "cached_acts",
  CACHED_RULES: "cached_rules",
  CACHED_NOTIFICATIONS: "cached_notifications",
  CACHED_ADVOCATES: "cached_advocates",
  CACHED_COURTS: "cached_courts",
  CACHED_CASES: "cached_cases",
  CACHED_COMPLAINTS: "cached_complaints",
  CHAT_HISTORY: "chat_history",
  OFFLINE_DATA: "offline_data",
} as const;

// Generic storage functions
export const storage = {
  // Set data
  set: async <T>(key: string, value: T): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error storing data for key ${key}:`, error);
      throw error;
    }
  },

  // Get data
  get: async <T>(key: string): Promise<T | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error retrieving data for key ${key}:`, error);
      return null;
    }
  },

  // Remove data
  remove: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
      throw error;
    }
  },

  // Clear all data
  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
      throw error;
    }
  },

  // Get multiple keys
  getMultiple: async (keys: string[]): Promise<Record<string, any>> => {
    try {
      const values = await AsyncStorage.multiGet(keys);
      const result: Record<string, any> = {};
      values.forEach(([key, value]) => {
        if (value !== null) {
          result[key] = JSON.parse(value);
        }
      });
      return result;
    } catch (error) {
      console.error("Error retrieving multiple keys:", error);
      return {};
    }
  },

  // Set multiple keys
  setMultiple: async (keyValuePairs: [string, any][]): Promise<void> => {
    try {
      const pairs: [string, string][] = keyValuePairs.map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]);
      await AsyncStorage.multiSet(pairs);
    } catch (error) {
      console.error("Error setting multiple keys:", error);
      throw error;
    }
  },
};

// Specific storage functions for app data
export const userStorage = {
  setUser: (user: any) => storage.set(STORAGE_KEYS.USER, user),
  getUser: () => storage.get(STORAGE_KEYS.USER),
  removeUser: () => storage.remove(STORAGE_KEYS.USER),
};

export const themeStorage = {
  setTheme: (theme: "light" | "dark") => storage.set(STORAGE_KEYS.THEME, theme),
  getTheme: () => storage.get<"light" | "dark">(STORAGE_KEYS.THEME),
};

export const languageStorage = {
  setLanguage: (language: string) =>
    storage.set(STORAGE_KEYS.LANGUAGE, language),
  getLanguage: () => storage.get<string>(STORAGE_KEYS.LANGUAGE),
};

// Cache management functions
export const cacheStorage = {
  // Acts and Rules cache
  setActsCache: (acts: any[]) =>
    storage.set(STORAGE_KEYS.CACHED_ACTS, {
      data: acts,
      timestamp: Date.now(),
    }),
  getActsCache: () => storage.get(STORAGE_KEYS.CACHED_ACTS),

  setRulesCache: (rules: any[]) =>
    storage.set(STORAGE_KEYS.CACHED_RULES, {
      data: rules,
      timestamp: Date.now(),
    }),
  getRulesCache: () => storage.get(STORAGE_KEYS.CACHED_RULES),

  setNotificationsCache: (notifications: any[]) =>
    storage.set(STORAGE_KEYS.CACHED_NOTIFICATIONS, {
      data: notifications,
      timestamp: Date.now(),
    }),
  getNotificationsCache: () => storage.get(STORAGE_KEYS.CACHED_NOTIFICATIONS),

  // Advocates and Courts cache
  setAdvocatesCache: (advocates: any[]) =>
    storage.set(STORAGE_KEYS.CACHED_ADVOCATES, {
      data: advocates,
      timestamp: Date.now(),
    }),
  getAdvocatesCache: () => storage.get(STORAGE_KEYS.CACHED_ADVOCATES),

  setCourtsCache: (courts: any[]) =>
    storage.set(STORAGE_KEYS.CACHED_COURTS, {
      data: courts,
      timestamp: Date.now(),
    }),
  getCourtsCache: () => storage.get(STORAGE_KEYS.CACHED_COURTS),

  // Cases and Complaints cache
  setCasesCache: (cases: any[]) =>
    storage.set(STORAGE_KEYS.CACHED_CASES, {
      data: cases,
      timestamp: Date.now(),
    }),
  getCasesCache: () => storage.get(STORAGE_KEYS.CACHED_CASES),

  setComplaintsCache: (complaints: any[]) =>
    storage.set(STORAGE_KEYS.CACHED_COMPLAINTS, {
      data: complaints,
      timestamp: Date.now(),
    }),
  getComplaintsCache: () => storage.get(STORAGE_KEYS.CACHED_COMPLAINTS),

  // Chat history
  setChatHistory: (messages: any[]) =>
    storage.set(STORAGE_KEYS.CHAT_HISTORY, messages),
  getChatHistory: () => storage.get(STORAGE_KEYS.CHAT_HISTORY),

  // Check if cache is valid (within 24 hours)
  isCacheValid: (timestamp: number): boolean => {
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
    return Date.now() - timestamp < CACHE_DURATION;
  },

  // Clear all cache
  clearAllCache: async () => {
    const cacheKeys = [
      STORAGE_KEYS.CACHED_ACTS,
      STORAGE_KEYS.CACHED_RULES,
      STORAGE_KEYS.CACHED_NOTIFICATIONS,
      STORAGE_KEYS.CACHED_ADVOCATES,
      STORAGE_KEYS.CACHED_COURTS,
      STORAGE_KEYS.CACHED_CASES,
      STORAGE_KEYS.CACHED_COMPLAINTS,
    ];

    try {
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  },
};

// Offline data management
export const offlineStorage = {
  // Save data for offline use
  saveOfflineData: async (key: string, data: any) => {
    try {
      const offlineData: Record<string, any> = ((await storage.get(
        STORAGE_KEYS.OFFLINE_DATA
      )) || {}) as Record<string, any>;
      offlineData[key] = {
        data,
        timestamp: Date.now(),
      };
      await storage.set(STORAGE_KEYS.OFFLINE_DATA, offlineData);
    } catch (error) {
      console.error("Error saving offline data:", error);
    }
  },

  // Get offline data
  getOfflineData: async (key: string) => {
    try {
      const offlineData = (await storage.get(
        STORAGE_KEYS.OFFLINE_DATA
      )) as Record<string, any>;
      return offlineData?.[key]?.data || null;
    } catch (error) {
      console.error("Error retrieving offline data:", error);
      return null;
    }
  },

  // Check if offline data exists
  hasOfflineData: async (key: string): Promise<boolean> => {
    try {
      const offlineData = (await storage.get(
        STORAGE_KEYS.OFFLINE_DATA
      )) as Record<string, any>;
      return !!offlineData?.[key];
    } catch (error) {
      console.error("Error checking offline data:", error);
      return false;
    }
  },

  // Clear offline data
  clearOfflineData: async (key?: string) => {
    try {
      if (key) {
        const offlineData = (await storage.get(
          STORAGE_KEYS.OFFLINE_DATA
        )) as Record<string, any>;
        if (offlineData) {
          delete offlineData[key];
          await storage.set(STORAGE_KEYS.OFFLINE_DATA, offlineData);
        }
      } else {
        await storage.remove(STORAGE_KEYS.OFFLINE_DATA);
      }
    } catch (error) {
      console.error("Error clearing offline data:", error);
    }
  },
};

export default storage;
