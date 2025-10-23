import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";
import { ROUTES } from "../../src/constants/routes";
import { useAppSelector } from "../../src/store";

const ConsumerCommissionScreen: React.FC = () => {
  const theme = useAppSelector((s) => s.app.theme);

  return (
    <SafeAreaView
      style={[styles.container, theme === "dark" && styles.darkContainer]}
      edges={["top"]}
    >
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='Women & Child Development' />

      <View style={styles.mainContent}>
        <View style={styles.content}>
          <Card style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardAccent} />
              <Text style={styles.cardTitle}>
                Offices of the Consumer Commission J&K
              </Text>
            </View>
            <Text style={styles.cardSubtitle}>
              A consumer commission is a regulatory body tasked with protecting
              consumer rights, resolving disputes, and enforcing fair trade
              practices.
            </Text>
            <Button
              title='Explore More'
              onPress={() =>
                router.push(ROUTES.CONSUMER_COMMISSION.LIST as any)
              }
              style={styles.exploreButton}
              textStyle={styles.exploreButtonText}
            />
          </Card>
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
  content: { paddingHorizontal: 20, paddingBottom: 24 },
  card: { marginBottom: 12, padding: 16 },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardAccent: {
    width: 3,
    height: 20,
    backgroundColor: "#007AFF",
    borderRadius: 2,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    flexShrink: 1,
  },
  cardSubtitle: { fontSize: 13, color: "#6B7280", marginBottom: 12 },
  exploreButton: {
    alignSelf: "flex-start",
    backgroundColor: "#FFC701",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 0,
  },
  exploreButtonText: { color: "#000", fontWeight: "600", fontSize: 14 },
});

export default ConsumerCommissionScreen;
