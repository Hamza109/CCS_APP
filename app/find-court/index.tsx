import { FontAwesome5 } from "@expo/vector-icons";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";
import { ROUTES } from "../../src/constants/routes";
import courtsApi from "../../src/services/courtsApi";
import { useAppSelector } from "../../src/store";

const FindMyCourtScreen: React.FC = () => {
  const theme = useAppSelector((s) => s.app.theme);
  const containerStyle = [
    styles.container,
    theme === "dark" && styles.darkContainer,
  ];

  const [isModalVisible, setModalVisible] = React.useState(false);
  const [isLocating, setIsLocating] = React.useState(false);
  const [nearestCourt, setNearestCourt] = React.useState<{
    id: number;
    court_name: string;
    address: string;
    lat: string;
    lng: string;
    district: string;
    distanceKm?: number;
  } | null>(null);

  const requestLocationOnce = React.useCallback(async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== Location.PermissionStatus.GRANTED) {
      const ask = await Location.requestForegroundPermissionsAsync();
      if (ask.status !== Location.PermissionStatus.GRANTED) {
        throw new Error("Location permission denied");
      }
    }
  }, []);

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const haversine = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <SafeAreaView style={containerStyle} edges={["top"]}>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='Find My Court' />
      <View style={styles.scrollView}>
        <View style={styles.mainContent}>
          <View style={styles.content}>
            {[
              {
                id: "list",
                title: "List of All District Courts in J&K",
                desc: "List of all District Courts in Jammu & Kashmir provides the names and locations of judicial courts at the district level across the Union Territory for handling civil and criminal cases.",
                url: ROUTES.FIND_COURT.LIST,
              },
              {
                id: "nearest",
                title: "Locate your nearest court",
                desc: "Locate your nearest court helps you find the closest court location based on your area for convenient access to judicial services.",
                url: "https://jkhighcourt.nic.in/district-courts",
              },
            ].map((item) => (
              <Card key={item.id} style={styles.card}>
                <View style={styles.cardHeaderRow}>
                  <View style={styles.cardAccent} />
                  <Text style={styles.title}>{item.title}</Text>
                </View>
                <Text style={styles.desc}>{item.desc}</Text>
                {item.id === "nearest" ? (
                  <Button
                    title='Locate'
                    onPress={async () => {
                      try {
                        setIsLocating(true);
                        await requestLocationOnce();
                        // Open modal immediately with loading text
                        setNearestCourt(null);
                        setModalVisible(true);
                        const loc = await Location.getCurrentPositionAsync({
                          accuracy: Location.Accuracy.Balanced,
                        });
                        const myLat = loc.coords.latitude;
                        const myLng = loc.coords.longitude;
                        const courts = await courtsApi.getCoordinates();
                        // Fast nearest calc (equirectangular approximation)
                        const cosLat = Math.cos(toRad(myLat));
                        let best: any = null;
                        for (const c of courts) {
                          const clat = parseFloat(c.lat);
                          const clng = parseFloat(c.lng);
                          const dx = (clng - myLng) * cosLat;
                          const dy = clat - myLat;
                          const d2 = dx * dx + dy * dy; // squared distance in deg^2
                          if (!best || d2 < best._d2) {
                            best = {
                              ...c,
                              _d2: d2,
                              distanceKm: Math.sqrt(d2) * 111.32, // approx km
                            };
                          }
                        }
                        if (best) {
                          setNearestCourt(best);
                        }
                      } catch (e) {
                        console.log("Nearest court error", e);
                      } finally {
                        setIsLocating(false);
                      }
                    }}
                    style={styles.exploreButton}
                    loading={isLocating}
                    textStyle={styles.exploreButtonText}
                  />
                ) : (
                  <Button
                    title='Explore More'
                    onPress={() => {
                      if (item.id === "list") {
                        // navigate within app
                        const { router } = require("expo-router");
                        router.push(item.url as any);
                      } else {
                        Linking.openURL(item.url);
                      }
                    }}
                    style={styles.exploreButton}
                    textStyle={styles.exploreButtonText}
                  />
                )}
              </Card>
            ))}
          </View>
          <Modal
            isVisible={isModalVisible}
            onBackdropPress={() => setModalVisible(false)}
          >
            <View style={styles.modalCard}>
              <Text style={[styles.modalTitle, { textAlign: "center" }]}>
                Nearest Court
              </Text>
              {nearestCourt ? (
                <>
                  <View style={styles.modalIconRow}>
                    <FontAwesome5
                      name='map-marker-alt'
                      size={70}
                      color='#DC2626'
                    />
                  </View>
                  <Text style={styles.modalCourtName}>
                    {nearestCourt.court_name}
                  </Text>
                  <Button
                    title='View route'
                    onPress={() => {
                      const uri = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                        `${nearestCourt.lat},${nearestCourt.lng}`
                      )}`;
                      Linking.openURL(uri);
                    }}
                    style={styles.modalButton}
                    textStyle={styles.modalButtonText}
                  />
                </>
              ) : (
                <View style={{ alignItems: "center" }}>
                  {isLocating ? (
                    <>
                      <ActivityIndicator size='large' color='#1E3A8A' />
                      <Text style={[styles.modalText, { marginTop: 8 }]}>
                        Finding nearest court...
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.modalText}>No court found</Text>
                  )}
                </View>
              )}
            </View>
          </Modal>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E3A8A" },
  darkContainer: { backgroundColor: "#000000" },
  scrollView: { flex: 1, backgroundColor: "#1E3A8A" },
  mainContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    flex: 1,
  },
  content: { padding: 16 },
  card: { marginBottom: 12, padding: 12 },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardAccent: {
    width: 3,
    height: 20,
    backgroundColor: "#007AFF",
    borderRadius: 2,
    marginRight: 8,
  },
  title: { fontSize: 14, fontWeight: "700", marginBottom: 8 },
  desc: { fontSize: 12, color: "#111827", marginBottom: 12 },
  exploreButton: {
    alignSelf: "flex-start",
    backgroundColor: "#FFC701",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 0,
  },
  exploreButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 14,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  modalText: { fontSize: 14, color: "#111827", marginBottom: 12 },
  modalIconRow: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  modalCourtName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },
  modalButton: {
    alignSelf: "center",
    backgroundColor: "#FFC701",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 0,
  },
  modalButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default FindMyCourtScreen;
