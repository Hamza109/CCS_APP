import { FlashList } from "@shopify/flash-list";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Linking, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";
import CustomPicker from "../../src/components/ui/Picker";
import { useDcpu, useDcpuDistricts } from "../../src/hooks/useDcpu";
import type { DcpuCenter } from "../../src/services/dcpuApi";
import { useAppSelector } from "../../src/store";

const DcpuCwcJjbScreen: React.FC = () => {
  const theme = useAppSelector((state) => state.app.theme);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  const { data: districtsData } = useDcpuDistricts();
  const districts = districtsData?.data || [];

  const { data, isLoading, isError } = useDcpu(selectedDistrict || undefined);
  const centers: DcpuCenter[] = (data?.data as DcpuCenter[]) || [];

  return (
    <SafeAreaView
      style={[styles.container, theme === "dark" && styles.darkContainer]}
      edges={["top"]}
    >
      <StatusBar style='light' backgroundColor='#1E3A8A' />

      <BlueHeader
        title='Office of the DCPU, CWC, JJB'
        subtitle='District Child Protection Unit, Child Welfare Committee, Juvenile Justice Board'
      />

      <View style={styles.contentList}>
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

        <FlashList<DcpuCenter>
          data={centers}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.organisation}</Text>
                <Text style={styles.cardDistrict}>{item.district}</Text>
              </View>
              <Text style={styles.cardOfficer}>
                {item.officer_name} • {item.designation}
              </Text>
              <Text style={styles.cardAddress}>{item.address}</Text>
              <View style={styles.actionsRow}>
                {item.mobile ? (
                  <Button
                    title='Call'
                    onPress={() => Linking.openURL(`tel:${item.mobile}`)}
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
                {item.lat && item.lng ? (
                  <Button
                    title='View Route'
                    onPress={() => {
                      const lat = Number(item.lat);
                      const lng = Number(item.lng);
                      const appUrl = Platform.select({
                        ios: `maps://app?daddr=${lat},${lng}`,
                        android: `geo:${lat},${lng}?q=${lat},${lng}(DCPU)`,
                        default: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                          `${lat},${lng}`
                        )}&travelmode=driving`,
                      }) as string;
                      Linking.openURL(appUrl);
                    }}
                    style={styles.routeButton}
                    textStyle={styles.routeButtonText}
                  />
                ) : null}
              </View>
            </Card>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {isLoading
                  ? "Loading DCPU centers..."
                  : isError
                  ? "Failed to load DCPU centers."
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
  container: {
    flex: 1,
    backgroundColor: "#1E3A8A",
  },
  darkContainer: {
    backgroundColor: "#000000",
  },
  contentList: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
  },
  pickerContainer: {
    paddingHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
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
  card: {
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
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
  cardAddress: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 10,
  },
  cardOfficer: {
    fontSize: 13,
    color: "#111827",
    marginBottom: 6,
    fontWeight: "600",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  callButton: {
    backgroundColor: "#1E3A8A",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  callButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
  emailButton: {
    backgroundColor: "#0EA5E9",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  emailButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
  routeButton: {
    backgroundColor: "#10B981",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  routeButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#6B7280",
  },
});

export default DcpuCwcJjbScreen;
