import { usePathname } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { Platform } from "react-native";
import { usePageHit } from "../../hooks/usePageHit";
import { useAppDispatch, useAppSelector } from "../../store";
import { setDeviceInfo } from "../../store/slices/appSlice";
import { collectDeviceInfo, type DeviceInfo } from "../../utils/deviceInfo";

type Props = {
  canRequestLocation: boolean;
};

function PageHitTracker({ canRequestLocation }: Props) {
  const pathname = usePathname();
  const { mutate } = usePageHit();
  const dispatch = useAppDispatch();
  const storedInfo = useAppSelector((state) => state.app.deviceInfo);
  const infoRef = useRef<DeviceInfo>({
    browser: Platform.OS === "ios" ? "iOS" : "Android",
  });
  const lastPathRef = useRef<string | null>(null);
  const isCollectingRef = useRef(false);

  const refreshDeviceInfo = useCallback(async () => {
    if (isCollectingRef.current) return; // Prevent multiple simultaneous calls
    isCollectingRef.current = true;
    try {
      const info = await collectDeviceInfo(canRequestLocation);
      infoRef.current = info;
      dispatch(setDeviceInfo(info));
      console.log("💾 Stored in Redux:", {
        state: info.state,
        district: info.district,
        country: info.country,
      });
    } finally {
      isCollectingRef.current = false;
    }
  }, [canRequestLocation, dispatch]);

  useEffect(() => {
    refreshDeviceInfo();
  }, [refreshDeviceInfo]);

  useEffect(() => {
    if (!pathname) return;
    if (pathname === lastPathRef.current) return;

    const sendPageHit = async () => {
      // Wait a bit for device info to be collected if it's not ready
      let info = storedInfo ?? infoRef.current;
      let attempts = 0;
      const maxAttempts = 10; // Wait up to 5 seconds (10 * 500ms)

      // Wait for device info to be ready (location data and geocoding)
      while (
        (!info.latitude || !info.longitude || isCollectingRef.current) &&
        attempts < maxAttempts
      ) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        info = storedInfo ?? infoRef.current;
        attempts++;
      }

      // Final check - use whatever we have
      info = storedInfo ?? infoRef.current;
      lastPathRef.current = pathname;

      const normalized = pathname.replace(/^\/+/, "");
      const sanitized = normalized.replace(/\(/g, "").replace(/\)/g, "");
      const pageName = sanitized.length > 0 ? sanitized : "home";

      console.log("📤 Sending page hit with:", {
        state: info.state || "null",
        district: info.district || "null",
        country: info.country || "null",
        hasLocation: !!(info.latitude && info.longitude),
      });

      mutate({
        page_name: pageName,
        ip_address: info.ip_address,
        browser: info.browser,
        latitude: info.latitude,
        longitude: info.longitude,
        district: info.district,
        state: info.state,
        country: info.country,
      });
    };

    sendPageHit();
  }, [pathname, storedInfo, mutate]);

  return null;
}

export default PageHitTracker;
