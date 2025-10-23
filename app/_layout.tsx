import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import NetworkStatus from "../src/components/ui/NetworkStatus";
import { useNetworkStatus } from "../src/hooks/useNetworkStatus";
import { useOfflineData } from "../src/hooks/useOfflineData";
import { persistor, store } from "../src/store";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function AppContent() {
  useNetworkStatus();
  const { loadCachedData } = useOfflineData();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    loadCachedData();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("auth_token");
        setIsLoggedIn(!!token);
      } catch {
        setIsLoggedIn(false);
      } finally {
        // Hide splash screen after auth check is complete
        SplashScreen.hideAsync();
      }
    };
    checkAuth();
  }, []);

  if (isLoggedIn === null) {
    return null;
  }

  return (
    <>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <NetworkStatus />
      <Stack screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name='(tabs)' />
        ) : (
          <Stack.Screen name='(auth)' />
        )}

        <Stack.Screen name='legal-aid' options={{}} />
        <Stack.Screen name='search-case' />
        <Stack.Screen name='pro-bono-lawyers' />
        <Stack.Screen name='district-litigation-officers' />
        <Stack.Screen name='para-legal-volunteers' />
        <Stack.Screen name='dlsa-contacts' />
        <Stack.Screen name='jk-lsa-schemes' />
        <Stack.Screen name='literacy-clubs' />

        <Stack.Screen name='contact-form' />
        <Stack.Screen name='high-court-search' />
        <Stack.Screen name='high-court-result' />
        <Stack.Screen name='district-court-search' />
        <Stack.Screen name='cat-search' />
        <Stack.Screen name='cat-result' />
        <Stack.Screen name='fcr-court-search' />
        <Stack.Screen name='landmark-judgements' />
        <Stack.Screen name='find-my-court' />
        <Stack.Screen name='list' />

        <Stack.Screen
          name='acts-rules'
          options={{
            headerShown: true,
            title: "Acts & Rules",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name='legislative-assembly'
          options={{
            headerShown: true,
            title: "Legislative Assembly",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name='litigation'
          options={{
            headerShown: true,
            title: "Litigation",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name='law-education'
          options={{
            headerShown: true,
            title: "Law Education",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name='advocates'
          options={{
            headerShown: true,
            title: "Advocates",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name='document-registration'
          options={{
            headerShown: true,
            title: "Document Registration",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name='marriage-registration'
          options={{
            headerShown: true,
            title: "Marriage Registration",
            headerBackTitle: "",
          }}
        />

        <Stack.Screen
          name='advocate-detail'
          options={{
            headerShown: true,
            title: "Advocate Details",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name='case-detail'
          options={{
            headerShown: true,
            title: "Case Details",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name='act-detail'
          options={{
            headerShown: true,
            title: "Act Details",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name='court-detail'
          options={{
            headerShown: true,
            title: "Court Details",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name='complaint-detail'
          options={{
            headerShown: true,
            title: "Complaint Details",
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name='mla-detail'
          options={{
            headerShown: true,
            title: "MLA Details",
            headerBackTitle: "",
          }}
        />
      </Stack>
    </>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <BottomSheetModalProvider>
              <AppContent />
            </BottomSheetModalProvider>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
