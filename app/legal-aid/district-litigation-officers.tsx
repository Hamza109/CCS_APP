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
  useDistrictLitigationOfficerDistricts,
  useDistrictLitigationOfficers,
} from "../../src/hooks/useDistrictLitigationOfficers";
import { DistrictLitigationOfficer } from "../../src/services/districtLitigationOfficersApi";
import { useAppSelector } from "../../src/store";

const DistrictLitigationOfficersScreen: React.FC = () => {
  const theme = useAppSelector((state) => state.app.theme);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  // Fetch districts for district litigation officers
  const { data: districtsData, isLoading: isLoadingDistricts } =
    useDistrictLitigationOfficerDistricts();
  const districts = districtsData?.data || [];

  // Fetch officers based on selected district
  const { data, isLoading, isError } = useDistrictLitigationOfficers(
    selectedDistrict || undefined
  );

  const officers: DistrictLitigationOfficer[] =
    (data?.data as DistrictLitigationOfficer[]) || [];

  const openPhoneCall = (phone: string) => {
    const phoneUrl = `tel:${phone}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          console.log("Phone calls not supported on this device");
        }
      })
      .catch((err) => console.error("Error opening phone:", err));
  };

  const openInGoogleMaps = (lat: string, lng: string) => {
    const appUrl = Platform.select({
      ios: `maps://app?daddr=${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}(District Litigation Office)`,
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
    <SafeAreaView
      style={[styles.container, theme === "dark" && styles.darkContainer]}
      edges={["top"]}
    >
      <StatusBar style='light' backgroundColor='#1E3A8A' />

      <BlueHeader title='District Litigation Offices' />

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

        <FlashList<DistrictLitigationOfficer>
          data={officers}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.officerListContent}
          renderItem={({ item }: { item: DistrictLitigationOfficer }) => {
            const hasCoordinates =
              item.lat &&
              item.lng &&
              item.lat !== "null" &&
              item.lng !== "null";
            return (
              <Card style={styles.officerCard}>
                <View style={styles.officerHeader}>
                  <Text style={styles.officerName}>{item.office_name}</Text>
                  <Text style={styles.officerDistrict}>
                    {item.district_name}
                  </Text>
                </View>

                <View style={styles.officerInfoRow}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Contact:</Text>
                    <Text style={styles.infoValue}>{item.contact_number}</Text>
                  </View>
                </View>

                <View style={styles.actionRow}>
                  <Button
                    title='Call'
                    onPress={() => openPhoneCall(item.contact_number)}
                    style={styles.actionButton}
                    textStyle={styles.actionButtonText}
                  />
                  {hasCoordinates && (
                    <Button
                      title='View Route'
                      onPress={() => openInGoogleMaps(item.lat, item.lng)}
                      style={styles.actionButton}
                      textStyle={styles.actionButtonText}
                    />
                  )}
                </View>
              </Card>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {isLoading
                  ? "Loading officers..."
                  : isError
                  ? "Failed to load officers. Check console for details."
                  : selectedDistrict
                  ? `No officers available for ${selectedDistrict}`
                  : "Please select a district to view officers"}
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
  container: {
    flex: 1,
    backgroundColor: "#1E3A8A",
  },
  darkContainer: {
    backgroundColor: "#000000",
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
  },
  darkText: {
    color: "#FFFFFF",
  },
  formRow: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 8,
  },
  pickerContainer: {
    paddingHorizontal: 16,
  },
  officerListContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  officerCard: {
    marginHorizontal: 0,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  officerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  officerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
    marginRight: 8,
  },
  officerDistrict: {
    fontSize: 12,
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  officerInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 16,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    backgroundColor: "#1E3A8A",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flex: 1,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  selectionSummary: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  selectionText: {
    fontSize: 14,
    color: "#111827",
  },
  selectionHint: {
    fontSize: 14,
    color: "#6B7280",
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#6B7280",
    textAlign: "center",
  },
});

export default DistrictLitigationOfficersScreen;
