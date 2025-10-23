import { FlashList } from "@shopify/flash-list";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useMemo, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Card from "../../src/components/ui/Card";
import { useFaqIgr } from "../../src/hooks/useFaqIgr";
import type { FaqItem } from "../../src/services/faqIgrApi";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function useDebouncedValue(value: string, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

const FaqScreen: React.FC = () => {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const debounced = useDebouncedValue(query);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useFaqIgr(debounced);

  const faqs: FaqItem[] = useMemo(
    () => data?.pages.flatMap((p) => p.data.data) ?? [],
    [data]
  );

  const toggle = useCallback((id: string | number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => ({ ...prev, [String(id)]: !prev[String(id)] }));
  }, []);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='Frequently Asked Questions' />
      <View style={styles.mainContent}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchLabel}>Search FAQs</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder='Type to search questions'
            style={styles.searchInput}
            clearButtonMode='while-editing'
          />
        </View>

        <FlashList<FaqItem>
          data={faqs}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isOpen = !!expanded[String(item.id)];
            const question =
              (item as any).question ?? (item as any).title ?? "";
            const answer = (item as any).answer ?? (item as any).content ?? "";
            return (
              <Card style={styles.card}>
                <View style={styles.questionRow}>
                  <Text onPress={() => toggle(item.id)} style={styles.question}>
                    {question}
                  </Text>
                  <Text
                    onPress={() => toggle(item.id)}
                    style={styles.toggleIcon}
                  >
                    {isOpen ? "−" : "+"}
                  </Text>
                </View>
                {isOpen ? <Text style={styles.answer}>{answer}</Text> : null}
              </Card>
            );
          }}
          onEndReachedThreshold={0.5}
          onEndReached={loadMore}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {isLoading ? "Loading FAQs..." : "No FAQs found"}
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
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  question: { fontSize: 15, fontWeight: "700", color: "#0F172A" },
  toggleIcon: { fontSize: 22, color: "#1E3A8A", fontWeight: "700" },
  answer: { marginTop: 8, fontSize: 13, color: "#374151" },
  emptyState: { paddingVertical: 40, alignItems: "center" },
  emptyText: { color: "#6B7280" },
});

export default FaqScreen;
