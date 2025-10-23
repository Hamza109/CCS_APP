import { FlashList } from "@shopify/flash-list";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Linking, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";
import CustomPicker from "../../src/components/ui/Picker";
import {
  useLiteracyClubDistricts,
  useLiteracyClubs,
} from "../../src/hooks/useLiteracyClubs";
import { LiteracyClub } from "../../src/services/literacyClubsApi";
import { useAppSelector } from "../../src/store";

const LiteracyClubsScreen: React.FC = () => {
  const theme = useAppSelector((state) => state.app.theme);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  const { data: districtsData, isLoading: isLoadingDistricts } =
    useLiteracyClubDistricts();
  const districts = districtsData?.data || [];

  const { data, isLoading, isError } = useLiteracyClubs(
    selectedDistrict || undefined
  );

  const clubs: LiteracyClub[] = (data?.data as LiteracyClub[]) || [];

  const openInGoogleMaps = (
    lat?: string | number | null,
    lng?: string | number | null
  ) => {
    if (lat == null || lng == null) return;
    const latNum = typeof lat === "string" ? parseFloat(lat) : lat;
    const lngNum = typeof lng === "string" ? parseFloat(lng) : lng;
    const dest = `${latNum},${lngNum}`;
    const appUrl = Platform.select({
      ios: `maps://app?daddr=${dest}`,
      android: `geo:${dest}?q=${dest}(Legal Literacy Club)`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        dest
      )}&travelmode=driving`,
    }) as string;
    Linking.openURL(appUrl).catch(() => {
      const browserUrl = `https://www.google.com/maps/search/?api=1&query=${dest}`;
      Linking.openURL(browserUrl);
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, theme === "dark" && styles.darkContainer]}
      edges={["top"]}
    >
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='Legal Literacy Clubs' />

      <View style={styles.mainContent}>
        <View style={styles.pickerContainer}>
          <CustomPicker
            label='Search by district'
            selectedValue={selectedDistrict}
            options={districts.map((district) => ({
              id: district,
              name: district,
            }))}
            onValueChange={setSelectedDistrict}
            placeholder='Select a district'
          />
        </View>

        {selectedDistrict ? (
          <View style={styles.selectionSummary}>
            <Text style={styles.selectionText}>
              Selected: {selectedDistrict}
            </Text>
          </View>
        ) : (
          <View style={styles.selectionSummary}>
            <Text style={styles.selectionHint}>
              Please select a district to continue.
            </Text>
          </View>
        )}

        <FlashList<LiteracyClub>
          data={clubs}
          keyExtractor={(item) => item.club_id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }: { item: LiteracyClub }) => (
            <Card style={styles.card}>
              <View style={styles.headerRow}>
                <Text style={styles.titleText}>{item.name}</Text>
                <Text style={styles.districtBadge}>{item.district_name}</Text>
              </View>
              {item.lat && item.lng ? (
                <View style={styles.actionRow}>
                  <Button
                    title='View Route'
                    onPress={() => openInGoogleMaps(item.lat, item.lng)}
                    style={styles.actionButton}
                    textStyle={styles.actionButtonText}
                  />
                </View>
              ) : null}
            </Card>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {isLoading
                  ? "Loading clubs..."
                  : isError
                  ? "Failed to load clubs. Check console for details."
                  : selectedDistrict
                  ? `No clubs available for ${selectedDistrict}`
                  : "Please select a district to view clubs"}
              </Text>
            </View>
          }
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
  darkText: { color: "#FFFFFF" },
  formRow: { paddingHorizontal: 20, marginBottom: 8 },
  label: { fontSize: 14, fontWeight: "600", color: "#0F172A", marginBottom: 8 },
  pickerContainer: {
    paddingHorizontal: 16,
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 24 },
  card: {
    marginHorizontal: 0,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
    marginRight: 8,
  },
  districtBadge: {
    fontSize: 12,
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  actionRow: { flexDirection: "row", gap: 8 },
  actionButton: {
    backgroundColor: "#1E3A8A",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  actionButtonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 14 },
  selectionSummary: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  selectionText: { fontSize: 14, color: "#111827" },
  selectionHint: { fontSize: 14, color: "#6B7280" },
  emptyState: { paddingVertical: 40, alignItems: "center" },
  emptyText: { color: "#6B7280", textAlign: "center" },
});

export default LiteracyClubsScreen;
