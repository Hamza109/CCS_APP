import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";
import { ROUTES } from "../../src/constants/routes";
import { useHighCourtList } from "../../src/hooks/useHighCourt";

const HighCourtListScreen: React.FC = () => {
  const params = useLocalSearchParams<Record<string, string | string[]>>();
  const query: any = {};
  Object.keys(params).forEach((k) => {
    const v = params[k];
    if (Array.isArray(v)) query[k] = v[0];
    else if (v !== "") query[k] = v;
  });
  // Defaults
  if (!query.per_page) query.per_page = 20;
  if (!query.page) query.page = 1;

  const { data, isLoading, error } = useHighCourtList(query);
  const items = data?.data || [];

  const renderItem = ({ item }: { item: any }) => (
    <Card style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Petitioner</Text>
        <Text style={styles.value}>{item.pet_name || "-"}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Respondent</Text>
        <Text style={styles.value}>{item.res_name || "-"}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>CINO</Text>
        <Text style={styles.code} numberOfLines={1}>
          {item.cino || "-"}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Date of Filing</Text>
        <Text style={styles.value}>{item.date_of_filing || "-"}</Text>
      </View>
      {!!item.cino && (
        <Button
          title='View More'
          onPress={() =>
            router.push({
              pathname: ROUTES.SEARCH_CASE.HIGH_COURT_RESULT,
              params: { cino: String(item.cino) },
            } as any)
          }
          style={{ marginTop: 8, backgroundColor: "#1E3A8A" }}
        />
      )}
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='High Court Search Results' />
      <View style={styles.body}>
        {isLoading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size='large' color='#1E3A8A' />
            <Text style={styles.loaderText}>Loading cases…</Text>
          </View>
        ) : error ? (
          <Card style={styles.card}>
            <Text style={styles.error}>Error loading results</Text>
          </Card>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(it, idx) => String(it.cino || idx)}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
            ListEmptyComponent={() => (
              <View style={styles.emptyWrap}>
                <Text style={styles.loaderText}>No cases found.</Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E3A8A" },
  body: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  card: { marginBottom: 12, padding: 12, backgroundColor: "#FFFFFF" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    paddingVertical: 4,
  },
  label: { width: 130, fontSize: 12, color: "#6B7280" },
  value: { flex: 1, fontSize: 12, color: "#111827" },
  code: {
    flex: 1,
    fontSize: 12,
    color: "#111827",
    fontFamily: Platform.select({ ios: "Courier", android: "monospace" }),
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loaderText: {
    fontSize: 12,
    color: "#6B7280",
  },
  emptyWrap: {
    alignItems: "center",
    paddingVertical: 40,
  },
  error: { color: "#B00020" },
});

export default HighCourtListScreen;
