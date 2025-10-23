import { FlashList } from "@shopify/flash-list";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Linking, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";
import CustomPicker from "../../src/components/ui/Picker";
import { useDistricts } from "../../src/hooks/useDistricts";
import { useLegalAidClinics } from "../../src/hooks/useLegalAidClinics";
import { LegalAidClinic } from "../../src/services/legalAidApi";
import { useAppSelector } from "../../src/store";

const LegalAidClinicsScreen: React.FC = () => {
  const theme = useAppSelector((state) => state.app.theme);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  // Fetch districts
  const { data: districtsData } = useDistricts();
  const districts = districtsData?.data || [];

  // Fetch clinics based on selected district
  const { data, isLoading, isError } = useLegalAidClinics(
    selectedDistrict || undefined
  );

  const clinics: LegalAidClinic[] = (data?.data as LegalAidClinic[]) || [];

  const openInGoogleMaps = (lat: number, lng: number) => {
    const appUrl = Platform.select({
      ios: `maps://app?daddr=${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}(Legal Aid Center)`,
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

      <BlueHeader title='List of legal aid clinics' />

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

        <FlashList<LegalAidClinic>
          data={clinics}
          keyExtractor={(item) => item.aid_id}
          contentContainerStyle={styles.clinicListContent}
          renderItem={({ item }: { item: LegalAidClinic }) => {
            const hasCoordinates = item.lat !== null && item.lng !== null;
            return (
              <Card style={styles.clinicCard}>
                <View style={styles.clinicHeader}>
                  <Text style={styles.clinicTitle}>{item.name}</Text>
                  <Text style={styles.clinicDistrict}>
                    {item.district_name}
                  </Text>
                </View>
                <Text style={styles.clinicAddress}>{item.address}</Text>
                <View style={styles.routeRow}>
                  {hasCoordinates && item.lat && item.lng ? (
                    <>
                      <Button
                        title='View Route'
                        onPress={() =>
                          openInGoogleMaps(
                            item.lat as number,
                            item.lng as number
                          )
                        }
                        style={styles.routeButton}
                        textStyle={styles.routeButtonText}
                      />
                    </>
                  ) : null}
                </View>
              </Card>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {isLoading
                  ? "Loading clinics..."
                  : isError
                  ? "Failed to load clinics. Check console for details."
                  : selectedDistrict
                  ? `No data available for ${selectedDistrict}`
                  : "Please select a district to view clinics"}
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
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  clinicListContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  pickerContainer: {
    paddingHorizontal: 16,
  },
  clinicCard: {
    marginHorizontal: 0,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  clinicHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  clinicTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
    marginRight: 8,
  },
  clinicDistrict: {
    fontSize: 12,
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  clinicAddress: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 10,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  coordsText: {
    fontSize: 12,
    color: "#6B7280",
  },
  routeButton: {
    backgroundColor: "#1E3A8A",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  routeButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
  itemCard: {
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemCardSelected: {
    borderColor: "#1E3A8A",
    borderWidth: 1,
  },
  itemText: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
  },
  darkItemText: {
    color: "#FFFFFF",
  },
  selectedBadge: {
    fontSize: 12,
    color: "#1E3A8A",
    fontWeight: "700",
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#6B7280",
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
  noLocationText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
});

export default LegalAidClinicsScreen;
