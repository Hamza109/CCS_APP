import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../store";
import { setOnlineStatus } from "../store/slices/appSlice";

export const useNetworkStatus = () => {
  const dispatch = useAppDispatch();
  const [isConnected, setIsConnected] = useState(true);
  const [connectionType, setConnectionType] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = state.isConnected ?? false;
      setIsConnected(connected);
      setConnectionType(state.type);

      // Update Redux store
      dispatch(setOnlineStatus(connected));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return {
    isConnected,
    connectionType,
    isOnline: isConnected,
    isOffline: !isConnected,
  };
};
