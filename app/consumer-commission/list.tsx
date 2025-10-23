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
  useConsumerDistricts,
  useConsumers,
} from "../../src/hooks/useConsumers";
import { useAppSelector } from "../../src/store";

const ConsumerCommissionListScreen: React.FC = () => {
  const theme = useAppSelector((s) => s.app.theme);
  const [district, setDistrict] = React.useState<string>("");

  const { data: districtsResp } = useConsumerDistricts();
  const districts = districtsResp?.data || [];
  const { data, isLoading, isError } = useConsumers(district || undefined);
  const consumers = data?.data || [];

  const openInMaps = (
    lat?: number | null,
    lng?: number | null,
    label?: string
  ) => {
    if (typeof lat !== "number" || typeof lng !== "number") return;
    const appUrl = Platform.select({
      ios: `maps://app?daddr=${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}(${
        label || "Consumer Commission"
      })`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        `${lat},${lng}`
      )}`,
    }) as string;
    Linking.openURL(appUrl);
  };

  return (
    <SafeAreaView
      style={[styles.container, theme === "dark" && styles.darkContainer]}
      edges={["top"]}
    >
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='Consumer Commission - J&K' />

      <View style={styles.mainContent}>
        <View style={styles.content}>
          <CustomPicker
            label='Search by district'
            selectedValue={district}
            options={districts.map((d: string) => ({ id: d, name: d }))}
            onValueChange={setDistrict}
            placeholder='Select a district'
          />

          <View style={styles.selectionSummary}>
            <Text style={styles.selectionText}>
              {district ? `Selected: ${district}` : "Select a district"}
            </Text>
          </View>

          <FlashList
            data={consumers}
            keyExtractor={(item: any, index) => String(item.id ?? index)}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }: { item: any }) => (
              <Card style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{item.name}</Text>
                  {item.district ? (
                    <Text style={styles.itemBadge}>{item.district}</Text>
                  ) : null}
                </View>
                {item.address ? (
                  <Text style={styles.itemMeta}>{item.address}</Text>
                ) : null}
                <View style={styles.routeRow}>
                  {item.lat && item.lng ? (
                    <Button
                      title='View Route'
                      onPress={() => openInMaps(item.lat, item.lng, item.name)}
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
                    ? "Loading offices..."
                    : isError
                    ? "Failed to load data"
                    : district
                    ? `No data available for ${district}`
                    : "Please select a district to view offices"}
                </Text>
              </View>
            }
          />
        </View>
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
  content: { flex: 1, paddingHorizontal: 20, paddingBottom: 24 },
  listContent: { paddingHorizontal: 5, paddingBottom: 10, paddingTop: 10 },
  selectionSummary: { paddingTop: 8, paddingBottom: 8 },
  selectionText: { fontSize: 14, color: "#111827" },
  itemCard: { marginBottom: 12, padding: 16 },
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
  itemBadge: {
    fontSize: 12,
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  itemMeta: { fontSize: 12, color: "#6B7280" },
  routeRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  routeButton: {
    alignSelf: "flex-start",
    backgroundColor: "#1E3A8A",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  routeButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
  emptyState: { paddingVertical: 40, alignItems: "center" },
  emptyText: { color: "#6B7280" },
});

export default ConsumerCommissionListScreen;
