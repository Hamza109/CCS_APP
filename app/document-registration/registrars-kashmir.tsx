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
  useRegistrarDistricts,
  useRegistrars,
} from "../../src/hooks/useRegistrars";
import type { Registrar } from "../../src/services/registrarsApi";

const RegistrarsKashmirScreen: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  const { data: districtsData } = useRegistrarDistricts();
  const districts = districtsData?.data || [];

  const { data, isLoading, isError } = useRegistrars(
    selectedDistrict || undefined,
    "kashmir"
  );
  const registrars: Registrar[] = (data?.data as Registrar[]) || [];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='Registrars & Sub-Registrars (Kashmir Division)' />
      <View style={styles.mainContent}>
        <View style={styles.pickerContainer}>
          <CustomPicker
            label='Search by district'
            selectedValue={selectedDistrict}
            options={districts.map((d) => ({ id: d, name: d }))}
            onValueChange={setSelectedDistrict}
            placeholder='Select a district'
          />
        </View>

        <View style={styles.selectionSummary}>
          <Text style={styles.selectionText}>
            {selectedDistrict
              ? `Selected: ${selectedDistrict}`
              : "Showing all districts"}
          </Text>
        </View>

        <FlashList<Registrar>
          data={registrars}
          keyExtractor={(item) => String(item.registrar_id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardDistrict}>{item.district_name}</Text>
              </View>
              <Text style={styles.cardDesignation}>{item.designation}</Text>
              <View style={styles.actionsRow}>
                {item.mobile_no ? (
                  <Button
                    title='Call'
                    onPress={() => Linking.openURL(`tel:${item.mobile_no}`)}
                    style={styles.callButton}
                    textStyle={styles.callButtonText}
                  />
                ) : null}
                {item.email ? (
                  <Button
                    title='Email'
                    onPress={() => Linking.openURL(`mailto:${item.email}`)}
                    style={styles.emailButton}
                    textStyle={styles.emailButtonText}
                  />
                ) : null}
              </View>
            </Card>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {isLoading
                  ? "Loading registrars..."
                  : isError
                  ? "Failed to load registrars."
                  : "No data available"}
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
  card: { marginBottom: 12, paddingHorizontal: 16, paddingVertical: 16 },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
    marginRight: 8,
  },
  cardDistrict: {
    fontSize: 12,
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  cardDesignation: { fontSize: 13, color: "#374151", marginBottom: 10 },
  actionsRow: { flexDirection: "row", gap: 8 },
  callButton: {
    backgroundColor: "#1E3A8A",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  callButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
  emailButton: {
    backgroundColor: "#0EA5E9",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  emailButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
  emptyState: { paddingVertical: 40, alignItems: "center" },
  emptyText: { color: "#6B7280" },
});

export default RegistrarsKashmirScreen;
