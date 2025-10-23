import { FlashList } from "@shopify/flash-list";
import type { InfiniteData } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Linking, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";
import { useNotaries } from "../../src/hooks/useNotaries";
import type { NotariesPage, NotaryItem } from "../../src/services/notariesApi";
import type { ApiResponse } from "../../src/types";

const NotariesScreen: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useNotaries(query);

  const pages =
    (data as InfiniteData<ApiResponse<NotariesPage>> | undefined)?.pages ?? [];
  const items: NotaryItem[] = React.useMemo(
    () => pages.flatMap((p) => p.data.data) as NotaryItem[],
    [pages]
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='List of Notaries' />
      <View style={styles.mainContent}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchLabel}>Search notaries</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder='Type address, district, or area'
            style={styles.searchInput}
          />
        </View>

        <FlashList<NotaryItem>
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Card style={styles.itemCard}>
              <Text style={styles.itemTitle}>{item.professional_address}</Text>
              <Text style={styles.itemMeta}>Area: {item.authorized_area}</Text>
              <Text style={styles.itemMeta}>District: {item.district}</Text>
              {item.contact_no ? (
                <>
                  <Text style={styles.itemMeta}>
                    Contact: {item.contact_no}
                  </Text>
                  <View style={styles.actionsRow}>
                    <Button
                      title='Call'
                      onPress={() => Linking.openURL(`tel:${item.contact_no}`)}
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
                {isLoading ? "Loading notaries..." : "No notaries found"}
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
  itemCard: { marginBottom: 12, paddingHorizontal: 16, paddingVertical: 16 },
  itemTitle: { fontSize: 14, fontWeight: "700", color: "#0F172A" },
  itemMeta: { fontSize: 13, color: "#374151" },
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

export default NotariesScreen;
