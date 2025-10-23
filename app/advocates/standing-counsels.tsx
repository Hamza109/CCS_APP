import { FlashList } from "@shopify/flash-list";
import type { InfiniteData } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";
import CustomPicker from "../../src/components/ui/Picker";
import {
  useStandingCounselDistricts,
  useStandingCounsels,
} from "../../src/hooks/useStandingCounsels";
import type {
  StandingCounselItem,
  StandingCounselsPage,
} from "../../src/services/standingCounselsApi";
import type { ApiResponse } from "../../src/types";

const StandingCounselsScreen: React.FC = () => {
  const [district, setDistrict] = React.useState("");
  const [query, setQuery] = React.useState("");

  const { data: districtsData } = useStandingCounselDistricts();
  const districts = districtsData?.data || [];

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useStandingCounsels(query, district || undefined);

  const pages =
    (data as InfiniteData<ApiResponse<StandingCounselsPage>> | undefined)
      ?.pages ?? [];
  const items: StandingCounselItem[] = pages.flatMap(
    (p) => p.data.data
  ) as StandingCounselItem[];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='List of Standing Counsels' />
      <View style={styles.mainContent}>
        <View style={styles.controls}>
          <CustomPicker
            label='Select district'
            selectedValue={district}
            options={districts.map((d: string) => ({ id: d, name: d }))}
            onValueChange={setDistrict}
            placeholder='Select district'
          />
        </View>

        <FlashList<StandingCounselItem>
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.headerRow}>
                <Text style={styles.name}>{item.counsel_name}</Text>
                <Text style={styles.badge}>{item.district}</Text>
              </View>
              {item.designation ? (
                <Text style={styles.meta}>{item.designation}</Text>
              ) : null}
              {item.allocation_work ? (
                <Text style={styles.meta}>{item.allocation_work}</Text>
              ) : null}
              <View style={styles.actionsRow}>
                {item.contact_no ? (
                  <Button
                    title='Call'
                    onPress={() => Linking.openURL(`tel:${item.contact_no}`)}
                    style={styles.callButton}
                    textStyle={styles.callButtonText}
                  />
                ) : null}
                {item.email_id ? (
                  <Button
                    title='Email'
                    onPress={() => Linking.openURL(`mailto:${item.email_id}`)}
                    style={styles.emailButton}
                    textStyle={styles.emailButtonText}
                  />
                ) : null}
              </View>
            </Card>
          )}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {isLoading ? "Loading counsels..." : "No data found"}
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
  mainContent: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
  },
  controls: { paddingHorizontal: 16, marginBottom: 8 },
  listContent: { paddingHorizontal: 20, paddingBottom: 24 },
  card: { marginBottom: 12, paddingHorizontal: 16, paddingVertical: 16 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  name: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  badge: {
    fontSize: 12,
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  meta: { fontSize: 13, color: "#374151", marginBottom: 8 },
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

export default StandingCounselsScreen;
