import * as Location from "expo-location";
import { Platform } from "react-native";

export type DeviceInfo = {
  latitude?: number;
  longitude?: number;
  district?: string;
  state?: string;
  country?: string;
  ip_address?: string;
  browser: string;
};

const IP_ENDPOINT = "https://api64.ipify.org?format=json";

async function fetchIpAddress(): Promise<string | undefined> {
  try {
    const response = await fetch(IP_ENDPOINT);
    if (!response.ok) return undefined;
    const data = (await response.json()) as { ip?: string };
    return data?.ip;
  } catch (error) {
    console.warn("Failed to fetch IP address", error);
    return undefined;
  }
}

async function ensureLocationPermission(
  canRequestPermission: boolean
): Promise<boolean> {
  let permission = await Location.getForegroundPermissionsAsync();
  if (
    permission.status !== Location.PermissionStatus.GRANTED &&
    canRequestPermission &&
    permission.canAskAgain
  ) {
    permission = await Location.requestForegroundPermissionsAsync();
  }
  return permission.status === Location.PermissionStatus.GRANTED;
}

async function getAddressFromCoordinatesFallback(
  latitude: number,
  longitude: number
): Promise<{
  state?: string;
  district?: string;
  country?: string;
} | null> {
  try {
    // Fallback to OpenStreetMap Nominatim API (free, no API key required)
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "CCS-App/1.0", // Required by Nominatim
      },
    });

    if (!response.ok) {
      console.warn("Nominatim API request failed");
      return null;
    }

    const data = (await response.json()) as any;
    if (data && data.address) {
      const addr = data.address;
      const result = {
        state: addr.state || addr.region || undefined,
        district: addr.county || addr.district || addr.city || undefined,
        country: addr.country || undefined,
      };
      console.log("📍 Address from Nominatim fallback:", {
        state: result.state,
        district: result.district,
        country: result.country,
      });
      return result;
    }
    return null;
  } catch (error) {
    console.warn("Fallback geocoding failed:", error);
    return null;
  }
}

async function getAddressFromCoordinates(
  latitude: number,
  longitude: number
): Promise<{
  state?: string;
  district?: string;
  country?: string;
} | null> {
  try {
    const geocodedLocation = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (geocodedLocation && geocodedLocation.length > 0) {
      const address = geocodedLocation[0];
      const result = {
        state: address.region ?? undefined,
        district: address.subregion || address.district || undefined,
        country: address.country ?? undefined,
      };
      console.log("📍 Address from Expo Location:", {
        state: result.state,
        district: result.district,
        country: result.country,
      });
      return result;
    }
    console.warn("No address found from Expo Location, trying fallback...");
    return await getAddressFromCoordinatesFallback(latitude, longitude);
  } catch (error: any) {
    // Handle NullPointerException from Expo when country code is missing
    const errorMsg = error?.message || String(error);
    if (
      errorMsg.includes("NullPointerException") ||
      errorMsg.includes("getCountryCode")
    ) {
      console.log(
        "⚠️ Expo reverse geocoding failed, trying fallback service..."
      );
      return await getAddressFromCoordinatesFallback(latitude, longitude);
    } else {
      console.warn("Error during reverse geocoding:", error);
      return await getAddressFromCoordinatesFallback(latitude, longitude);
    }
  }
}

async function fetchLocationMetadata(
  canRequestPermission: boolean
): Promise<
  Pick<DeviceInfo, "latitude" | "longitude" | "district" | "state" | "country">
> {
  try {
    const hasPermission = await ensureLocationPermission(canRequestPermission);
    if (!hasPermission) {
      return {};
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const address = await getAddressFromCoordinates(latitude, longitude);
    const result = {
      latitude,
      longitude,
      district: address?.district,
      state: address?.state,
      country: address?.country,
    };
    console.log("🌍 Location metadata:", {
      latitude: result.latitude,
      longitude: result.longitude,
      state: result.state || "N/A",
      district: result.district || "N/A",
      country: result.country || "N/A",
    });
    return result;
  } catch (error) {
    console.warn("Failed to resolve device location", error);
    return {};
  }
}

export async function collectDeviceInfo(
  canRequestPermission: boolean
): Promise<DeviceInfo> {
  const browser = Platform.OS === "ios" ? "iOS" : "Android";
  const [ip_address, locationMeta] = await Promise.all([
    fetchIpAddress(),
    fetchLocationMetadata(canRequestPermission),
  ]);

  return {
    browser,
    ip_address,
    ...locationMeta,
  };
}
