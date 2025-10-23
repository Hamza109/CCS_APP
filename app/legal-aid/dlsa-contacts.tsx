import { FlashList } from "@shopify/flash-list";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";
import CustomPicker from "../../src/components/ui/Picker";
import { useDlsaContacts, useDlsaDistricts } from "../../src/hooks/useDlsa";
import { DlsaContact } from "../../src/services/dlsaApi";
import { useAppSelector } from "../../src/store";

const DlsaContactsScreen: React.FC = () => {
  const theme = useAppSelector((state) => state.app.theme);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  const { data: districtsData, isLoading: isLoadingDistricts } =
    useDlsaDistricts();
  const districts = districtsData?.data || [];

  const { data, isLoading, isError } = useDlsaContacts(
    selectedDistrict || undefined
  );
  const contacts: DlsaContact[] = (data?.data as DlsaContact[]) || [];

  const openPhoneCall = (phone?: string) => {
    if (!phone) return;
    const phoneUrl = `tel:${phone}`;
    Linking.openURL(phoneUrl).catch(() => {});
  };

  return (
    <SafeAreaView
      style={[styles.container, theme === "dark" && styles.darkContainer]}
      edges={["top"]}
    >
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='SLSA/DLSA Contacts' />

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

        <FlashList<DlsaContact>
          data={contacts}
          keyExtractor={(item) => item.dlsa_id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }: { item: DlsaContact }) => (
            <Card style={styles.card}>
              <View style={styles.headerRow}>
                <Text style={styles.nameText}>{item.name}</Text>
                {item.name_dlsa ? (
                  <Text style={styles.districtBadge}>{item.name_dlsa}</Text>
                ) : null}
              </View>

              <View style={styles.infoRow}>
                {item.designation ? (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Designation:</Text>
                    <Text style={styles.infoValue}>{item.designation}</Text>
                  </View>
                ) : null}
                {item.mobile_no ? (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Mobile:</Text>
                    <Text style={styles.infoValue}>{item.mobile_no}</Text>
                  </View>
                ) : null}
                {item.alternate_no ? (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Alternate:</Text>
                    <Text style={styles.infoValue}>{item.alternate_no}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.actionRow}>
                {item.mobile_no ? (
                  <Button
                    title='Call'
                    onPress={() => openPhoneCall(item.mobile_no)}
                    style={styles.actionButton}
                    textStyle={styles.actionButtonText}
                  />
                ) : null}
              </View>
            </Card>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {isLoading
                  ? "Loading contacts..."
                  : isError
                  ? "Failed to load contacts. Check console for details."
                  : selectedDistrict
                  ? `No contacts available for ${selectedDistrict}`
                  : "Please select a district to view contacts"}
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
  nameText: {
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
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 16,
  },
  infoItem: { flex: 1 },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 2,
  },
  infoValue: { fontSize: 14, color: "#374151", fontWeight: "500" },
  actionRow: { flexDirection: "row", gap: 8 },
  actionButton: {
    backgroundColor: "#1E3A8A",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flex: 1,
  },
  actionButtonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 14 },
  selectionSummary: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  selectionText: { fontSize: 14, color: "#111827" },
  selectionHint: { fontSize: 14, color: "#6B7280" },
  emptyState: { paddingVertical: 40, alignItems: "center" },
  emptyText: { color: "#6B7280", textAlign: "center" },
});

export default DlsaContactsScreen;
