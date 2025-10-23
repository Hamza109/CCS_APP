import { FlashList } from "@shopify/flash-list";
import type { InfiniteData } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Linking, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";
import { useEcourtBranches } from "../../src/hooks/useEcourtBranches";
import type {
  EcourtBranch,
  EcourtBranchesPage,
} from "../../src/services/ecourtBranchesApi";
import type { ApiResponse } from "../../src/types";

function useDebouncedValue(value: string, delay = 400) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

const EcourtFeeBranchesScreen: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const debounced = useDebouncedValue(query);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useEcourtBranches(debounced);

  const pages =
    (data as InfiniteData<ApiResponse<EcourtBranchesPage>> | undefined)
      ?.pages ?? [];
  const branches: EcourtBranch[] = React.useMemo(
    () => pages.flatMap((p) => p.data.data) as EcourtBranch[],
    [pages]
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='List of e-Court Fee Branches' />
      <View style={styles.mainContent}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchLabel}>Search branches</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder='Type account name, location, or mobile number'
            style={styles.searchInput}
          />
        </View>

        <FlashList<EcourtBranch>
          data={branches}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Text style={styles.name}>
                {(item as any).account_name || item.name || item.branch_name}
              </Text>
              {(item as any).branch_location || item.district ? (
                <Text style={styles.meta}>
                  Location: {(item as any).branch_location || item.district}
                </Text>
              ) : null}
              {item.address ? (
                <Text style={styles.meta}>{item.address}</Text>
              ) : null}
              {(item as any).mobile_no || item.phone ? (
                <>
                  <Text style={styles.meta}>
                    Mobile: {(item as any).mobile_no || item.phone}
                  </Text>
                  <View style={styles.actionsRow}>
                    <Button
                      title='Call'
                      onPress={() =>
                        Linking.openURL(
                          `tel:${(item as any).mobile_no || item.phone}`
                        )
                      }
                      style={styles.callButton}
                      textStyle={styles.callButtonText}
                    />
                  </View>
                </>
              ) : null}
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
                {isLoading ? "Loading branches..." : "No branches found"}
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
  actionsRow: { flexDirection: "row", marginTop: 8, width: "100%" },
  callButton: {
    backgroundColor: "#1E3A8A",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    width: "100%",
  },
  callButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
  emptyState: { paddingVertical: 40, alignItems: "center" },
  emptyText: { color: "#6B7280" },
});

export default EcourtFeeBranchesScreen;
