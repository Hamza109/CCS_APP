import { FlashList } from "@shopify/flash-list";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";
import { useSchemes } from "../../src/hooks/useSchemes";
import { Scheme } from "../../src/services/schemesApi";
import { useAppSelector } from "../../src/store";

const FILE_BASE_URL = "http://10.149.13.209/ccsproject/"; // concat with file_path

const JkLsaSchemesScreen: React.FC = () => {
  const theme = useAppSelector((state) => state.app.theme);
  const { data, isLoading, isError } = useSchemes();
  const schemes: Scheme[] = (data?.data as Scheme[]) || [];

  const openSchemeFile = (relativePath: string) => {
    // Normalize '../' from file_path
    const cleaned = relativePath.replace(/^\.\.\//, "");
    const url = `${FILE_BASE_URL}${cleaned}`;
    console.log('url->',url)
    Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView
      style={[styles.container, theme === "dark" && styles.darkContainer]}
      edges={["top"]}
    >
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='J&K LSA Schemes' />

      <View style={styles.mainContent}>
        <FlashList<Scheme>
          data={schemes}
          keyExtractor={(item) => item.scheme_id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }: { item: Scheme }) => (
            <Card style={styles.card}>
              <Text style={styles.titleText}>{item.title}</Text>
              {item.description ? (
                <Text style={styles.descText}>{item.description}</Text>
              ) : null}
              {item.file_path ? (
                <View style={styles.actionRow}>
                  <Button
                    title='Open PDF'
                    onPress={() => openSchemeFile(item.file_path)}
                    style={styles.actionButton}
                    textStyle={styles.actionButtonText}
                  />
                </View>
              ) : null}
            </Card>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {isLoading
                  ? "Loading schemes..."
                  : isError
                  ? "Failed to load schemes. Check console for details."
                  : "No schemes available"}
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
  darkContainer: { backgroundColor: "#000000" },
  mainContent: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 24 },
  card: {
    marginHorizontal: 0,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  descText: { fontSize: 13, color: "#374151", marginBottom: 12 },
  actionRow: { flexDirection: "row", gap: 8 },
  actionButton: {
    backgroundColor: "#1E3A8A",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  actionButtonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 14 },
  emptyState: { paddingVertical: 40, alignItems: "center" },
  emptyText: { color: "#6B7280", textAlign: "center" },
});

export default JkLsaSchemesScreen;
