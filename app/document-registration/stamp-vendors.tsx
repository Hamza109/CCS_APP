import { FlashList } from "@shopify/flash-list";
import type { InfiniteData } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Card from "../../src/components/ui/Card";
import { useEstampVendors } from "../../src/hooks/useEstampVendors";
import type {
  EstampVendor,
  EstampVendorsPage,
} from "../../src/services/estampVendorsApi";
import type { ApiResponse } from "../../src/types";

function useDebouncedValue(value: string, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

const StampVendorsScreen: React.FC = () => {
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useEstampVendors(debounced);

  const pages =
    (data as InfiniteData<ApiResponse<EstampVendorsPage>> | undefined)?.pages ??
    [];
  const vendors: EstampVendor[] = useMemo(
    () => pages.flatMap((p) => p.data.data) as EstampVendor[],
    [pages]
  );

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='List of Stamp Vendors' />
      <View style={styles.mainContent}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchLabel}>Search vendors</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder='Type name, account id, or phone'
            style={styles.searchInput}
            clearButtonMode='while-editing'
          />
        </View>

        <FlashList<EstampVendor>
          data={vendors}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Text style={styles.name}>{item.account_name}</Text>
              <Text style={styles.meta}>Acct ID: {item.acctid}</Text>
              <Text style={styles.meta}>Branch: {item.branchcd}</Text>
              <Text style={styles.meta}>{item.branch_address}</Text>
              {item.branch_phone ? (
                <Text style={styles.meta}>
                  Branch Phone: {item.branch_phone}
                </Text>
              ) : null}
              {item.account_phone ? (
                <Text style={styles.meta}>
                  Account Phone: {item.account_phone}
                </Text>
              ) : null}
            </Card>
          )}
          onEndReachedThreshold={0.5}
          onEndReached={loadMore}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {isLoading ? "Loading vendors..." : "No vendors found"}
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
  name: { fontSize: 16, fontWeight: "700", color: "#0F172A", marginBottom: 6 },
  meta: { fontSize: 13, color: "#374151" },
  emptyState: { paddingVertical: 40, alignItems: "center" },
  emptyText: { color: "#6B7280" },
});

export default StampVendorsScreen;
