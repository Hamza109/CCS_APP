import { FlashList } from "@shopify/flash-list";
import type { InfiniteData } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Linking, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";
import { useAdvocates } from "../../src/hooks/useAdvocates";
import type {
  AdvocateItem,
  AdvocatesPage,
} from "../../src/services/advocatesApi";
import type { ApiResponse } from "../../src/types";

const AdvocatesListScreen: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useAdvocates(query);

  const pages =
    (data as InfiniteData<ApiResponse<AdvocatesPage>> | undefined)?.pages ?? [];
  const items: AdvocateItem[] = React.useMemo(
    () => pages.flatMap((p) => p.data.data) as AdvocateItem[],
    [pages]
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='List of Advocates' />
      <View style={styles.mainContent}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchLabel}>Search advocates</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder='Type name, district, or enrollment no.'
            style={styles.searchInput}
          />
        </View>

        <FlashList<AdvocateItem>
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.headerRow}>
                <Text style={styles.name}>{item.name}</Text>
                {item.district ? (
                  <Text style={styles.badge}>{item.district}</Text>
                ) : null}
              </View>
              {item.enrollment_no ? (
                <Text style={styles.meta}>
                  Enrollment: {item.enrollment_no}
                </Text>
              ) : null}
              {item.address ? (
                <Text style={styles.meta}>{item.address}</Text>
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
                {isLoading ? "Loading advocates..." : "No advocates found"}
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
  searchContainer: { paddingHorizontal: 16, marginBottom: 8 },
  searchLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },
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

export default AdvocatesListScreen;
