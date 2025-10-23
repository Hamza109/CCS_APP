import { FlashList } from "@shopify/flash-list";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";
import CustomPicker from "../../src/components/ui/Picker";
import {
  useProBonoLawyerDistricts,
  useProBonoLawyers,
} from "../../src/hooks/useProBonoLawyers";
import { ProBonoLawyer } from "../../src/services/proBonoLawyersApi";
import { useAppSelector } from "../../src/store";

const ProBonoLawyersScreen: React.FC = () => {
  const theme = useAppSelector((state) => state.app.theme);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  // Fetch districts for pro-bono lawyers
  const { data: districtsData, isLoading: isLoadingDistricts } =
    useProBonoLawyerDistricts();
  const districts = districtsData?.data || [];

  // Fetch lawyers based on selected district
  const { data, isLoading, isError } = useProBonoLawyers(
    selectedDistrict || undefined
  );

  const lawyers: ProBonoLawyer[] = (data?.data as ProBonoLawyer[]) || [];

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

  return (
    <SafeAreaView
      style={[styles.container, theme === "dark" && styles.darkContainer]}
      edges={["top"]}
    >
      <StatusBar style='light' backgroundColor='#1E3A8A' />

      <BlueHeader title='List of Pro-Bono Lawyers' />

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

        <FlashList<ProBonoLawyer>
          data={lawyers}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.lawyerListContent}
          renderItem={({ item }: { item: ProBonoLawyer }) => {
            return (
              <Card style={styles.lawyerCard}>
                <View style={styles.lawyerHeader}>
                  <Text style={styles.lawyerName}>{item.name}</Text>
                </View>

                <View style={styles.lawyerInfoRow}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>District:</Text>
                    <Text style={styles.infoValue}>{item.district_name}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Mobile:</Text>
                    <Text style={styles.infoValue}>{item.mobile_number}</Text>
                  </View>
                </View>

                <View style={styles.contactRow}>
                  <Button
                    title='Call'
                    onPress={() => openPhoneCall(item.mobile_number)}
                    style={styles.contactButton}
                    textStyle={styles.contactButtonText}
                  />
                </View>
              </Card>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {isLoading
                  ? "Loading lawyers..."
                  : isError
                  ? "Failed to load lawyers. Check console for details."
                  : selectedDistrict
                  ? `No lawyers available for ${selectedDistrict}`
                  : "Please select a district to view lawyers"}
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

  lawyerListContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  lawyerCard: {
    marginHorizontal: 0,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  lawyerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  lawyerName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
    marginRight: 8,
  },
  lawyerInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
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
  contactRow: {
    marginTop: 8,
  },
  contactButton: {
    backgroundColor: "#1E3A8A",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  contactButtonText: {
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
  pickerContainer: {
    paddingHorizontal: 16,
  },
});

export default ProBonoLawyersScreen;
