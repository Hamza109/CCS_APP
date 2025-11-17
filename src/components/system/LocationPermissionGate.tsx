import * as Location from "expo-location";
import { useEffect } from "react";

type Props = {
  requestKey: number;
};

function LocationPermissionGate({ requestKey }: Props) {
  useEffect(() => {
    if (!requestKey) return;

    let isMounted = true;

    (async () => {
      try {
        const current = await Location.getForegroundPermissionsAsync();
        if (
          isMounted &&
          current.status !== Location.PermissionStatus.GRANTED &&
          current.canAskAgain
        ) {
          await Location.requestForegroundPermissionsAsync();
        }
      } catch (error) {
        console.warn("Location permission request failed", error);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [requestKey]);

  return null;
}

export default LocationPermissionGate;
