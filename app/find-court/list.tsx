import { FlashList } from "@shopify/flash-list";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Linking, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";
import CustomPicker from "../../src/components/ui/Picker";
import {
  useCourtCoordinates,
  useCourtDistricts,
} from "../../src/hooks/useCourts";
import { useAppSelector } from "../../src/store";

const DistrictCourtsListScreen: React.FC = () => {
  const theme = useAppSelector((s) => s.app.theme);
  const containerStyle = [
    styles.container,
    theme === "dark" && styles.darkContainer,
  ];
  const [district, setDistrict] = React.useState<string>("");

  const { data: districts } = useCourtDistricts();
  const pickerOptions = (districts || []).map((d) => ({ id: d, name: d }));

  const {
    data: courts,
    isLoading,
    error,
  } = useCourtCoordinates(district || undefined);

  const openInGoogleMaps = (lat: number, lng: number, label?: string) => {
    const queryLabel = label ? `(${label})` : "District Court";
    const appUrl = Platform.select({
      ios: `maps://app?daddr=${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}${queryLabel}`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        `${lat},${lng}`
      )}&travelmode=driving`,
    }) as string;

    Linking.canOpenURL(appUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(appUrl);
        } else {
          const browserUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
          Linking.openURL(browserUrl);
        }
      })
      .catch(() => {
        const browserUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        Linking.openURL(browserUrl);
      });
  };

  return (
    <SafeAreaView style={containerStyle} edges={["top"]}>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='List of district courts' />
      <View style={styles.mainContent}>
        <View style={styles.pickerContainer}>
          <CustomPicker
            label='Search by district'
            selectedValue={district}
            options={pickerOptions}
            onValueChange={setDistrict}
            placeholder='Select a district'
          />
        </View>
        <View style={styles.selectionSummary}>
          <Text style={styles.selectionText}>
            {district ? `Selected: ${district}` : "Select a district"}
          </Text>
        </View>

        <FlashList
          data={courts || []}
          keyExtractor={(item: any) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }: any) => {
            const hasCoordinates = !!item.lat && !!item.lng;
            return (
              <Card style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{item.court_name}</Text>
                  <Text style={styles.itemDistrict}>{item.district}</Text>
                </View>
                <Text style={styles.itemAddress}>{item.address}</Text>
                <View style={styles.routeRow}>
                  {hasCoordinates ? (
                    <Button
                      title='View Route'
                      onPress={() =>
                        openInGoogleMaps(
                          parseFloat(item.lat),
                          parseFloat(item.lng),
                          item.court_name
                        )
                      }
                      style={styles.routeButton}
                      textStyle={styles.routeButtonText}
                    />
                  ) : null}
                </View>
              </Card>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {isLoading
                  ? "Loading courts..."
                  : error
                  ? "Failed to load courts."
                  : district
                  ? `No data available for ${district}`
                  : "No courts found"}
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E3A8A" },
  darkContainer: { backgroundColor: "#000000" },
  mainContent: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
  },
  pickerContainer: { paddingHorizontal: 16 },
  listContent: { paddingHorizontal: 20, paddingBottom: 24 },
  selectionSummary: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  selectionText: { fontSize: 14, color: "#111827" },
  selectionHint: { fontSize: 14, color: "#6B7280" },
  itemCard: {
    marginHorizontal: 0,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
    marginRight: 8,
  },
  itemDistrict: {
    fontSize: 12,
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  itemAddress: { fontSize: 13, color: "#374151" },
  routeRow: { flexDirection: "row", alignItems: "center" },
  routeButton: {
    backgroundColor: "#1E3A8A",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  routeButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
  emptyState: { paddingVertical: 40, alignItems: "center" },
  emptyText: { color: "#6B7280" },
});

export default DistrictCourtsListScreen;
