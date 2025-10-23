import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import {
  setActs,
  setNotifications,
  setRules,
} from "../store/slices/actsRulesSlice";
import { setMessages } from "../store/slices/chatbotSlice";
import { setComplaints } from "../store/slices/grievanceSlice";
import { setAdvocates, setCourts } from "../store/slices/legalAidSlice";
import { setCases } from "../store/slices/litigationSlice";
import { cacheStorage, offlineStorage } from "../utils/storage";

export const useOfflineData = () => {
  const dispatch = useAppDispatch();
  const isOnline = useAppSelector((state) => state.app.isOnline);
  const [isLoading, setIsLoading] = useState(false);

  // Load cached data when app starts
  useEffect(() => {
    loadCachedData();
  }, []);

  // Save data when going offline
  useEffect(() => {
    if (!isOnline) {
      saveCurrentDataForOffline();
    }
  }, [isOnline]);

  const loadCachedData = async () => {
    try {
      setIsLoading(true);

      // Load cached advocates
      const advocatesCache = (await cacheStorage.getAdvocatesCache()) as any;
      if (
        advocatesCache &&
        cacheStorage.isCacheValid(advocatesCache.timestamp)
      ) {
        dispatch(setAdvocates(advocatesCache.data));
      }

      // Load cached courts
      const courtsCache = (await cacheStorage.getCourtsCache()) as any;
      if (courtsCache && cacheStorage.isCacheValid(courtsCache.timestamp)) {
        dispatch(setCourts(courtsCache.data));
      }

      // Load cached acts
      const actsCache = (await cacheStorage.getActsCache()) as any;
      if (actsCache && cacheStorage.isCacheValid(actsCache.timestamp)) {
        dispatch(setActs(actsCache.data));
      }

      // Load cached rules
      const rulesCache = (await cacheStorage.getRulesCache()) as any;
      if (rulesCache && cacheStorage.isCacheValid(rulesCache.timestamp)) {
        dispatch(setRules(rulesCache.data));
      }

      // Load cached notifications
      const notificationsCache =
        (await cacheStorage.getNotificationsCache()) as any;
      if (
        notificationsCache &&
        cacheStorage.isCacheValid(notificationsCache.timestamp)
      ) {
        dispatch(setNotifications(notificationsCache.data));
      }

      // Load cached cases
      const casesCache = (await cacheStorage.getCasesCache()) as any;
      if (casesCache && cacheStorage.isCacheValid(casesCache.timestamp)) {
        dispatch(setCases(casesCache.data));
      }

      // Load cached complaints
      const complaintsCache = (await cacheStorage.getComplaintsCache()) as any;
      if (
        complaintsCache &&
        cacheStorage.isCacheValid(complaintsCache.timestamp)
      ) {
        dispatch(setComplaints(complaintsCache.data));
      }

      // Load chat history
      const chatHistory = (await cacheStorage.getChatHistory()) as any;
      if (chatHistory) {
        dispatch(setMessages(chatHistory));
      }
    } catch (error) {
      console.error("Error loading cached data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCurrentDataForOffline = async () => {
    try {
      // This would be called when the app goes offline
      // to save the current state for offline access
      console.log("Saving current data for offline access...");
    } catch (error) {
      console.error("Error saving offline data:", error);
    }
  };

  const saveDataToCache = async (dataType: string, data: any) => {
    try {
      switch (dataType) {
        case "advocates":
          await cacheStorage.setAdvocatesCache(data);
          break;
        case "courts":
          await cacheStorage.setCourtsCache(data);
          break;
        case "acts":
          await cacheStorage.setActsCache(data);
          break;
        case "rules":
          await cacheStorage.setRulesCache(data);
          break;
        case "notifications":
          await cacheStorage.setNotificationsCache(data);
          break;
        case "cases":
          await cacheStorage.setCasesCache(data);
          break;
        case "complaints":
          await cacheStorage.setComplaintsCache(data);
          break;
        case "chat":
          await cacheStorage.setChatHistory(data);
          break;
        default:
          console.warn(`Unknown data type: ${dataType}`);
      }
    } catch (error) {
      console.error(`Error saving ${dataType} to cache:`, error);
    }
  };

  const clearCache = async () => {
    try {
      await cacheStorage.clearAllCache();
      console.log("Cache cleared successfully");
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  };

  const getOfflineData = async (key: string) => {
    try {
      return await offlineStorage.getOfflineData(key);
    } catch (error) {
      console.error(`Error getting offline data for key ${key}:`, error);
      return null;
    }
  };

  const saveOfflineData = async (key: string, data: any) => {
    try {
      await offlineStorage.saveOfflineData(key, data);
    } catch (error) {
      console.error(`Error saving offline data for key ${key}:`, error);
    }
  };

  return {
    isLoading,
    loadCachedData,
    saveDataToCache,
    clearCache,
    getOfflineData,
    saveOfflineData,
  };
};
