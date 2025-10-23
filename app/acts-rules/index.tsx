import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";
import { ROUTES } from "../../src/constants/routes";
import { useAppSelector } from "../../src/store";

const ActsRulesIndexScreen: React.FC = () => {
  const theme = useAppSelector((s) => s.app.theme);

  return (
    <SafeAreaView
      style={[styles.container, theme === "dark" && styles.darkContainer]}
      edges={["top"]}
    >
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='Acts, Rule and Notifications' />
      <View style={styles.mainContent}>
        <View style={styles.content}>
          <Card style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardAccent} />
              <Text style={styles.cardTitle}>
                Acts, Rule and Notifications of J&K UT
              </Text>
            </View>
            <Text style={styles.cardSubtitle}>
              Legal enactments, regulatory rules, and official notifications
              applicable within the Union Territory of Jammu & Kashmir.
            </Text>
            <Button
              title='Explore More'
              onPress={() => router.push(ROUTES.ACTS_RULES.UT as any)}
              style={styles.routeButton}
              textStyle={styles.routeButtonText}
            />
          </Card>

          <Card style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardAccent} />
              <Text style={styles.cardTitle}>
                Acts, Rule and Notifications of Centre
              </Text>
            </View>
            <Text style={styles.cardSubtitle}>
              Laws, regulations, and government notifications issued by the
              Central Government of India, applicable nationwide.
            </Text>
            <Button
              title='Explore More'
              onPress={() => Linking.openURL("https://www.indiacode.nic.in/")}
              style={styles.routeButton}
              textStyle={styles.routeButtonText}
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
  card: { marginBottom: 16, padding: 16 },
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
    marginBottom: 6,
  },
  cardSubtitle: { fontSize: 13, color: "#374151", marginBottom: 10 },
  routeButton: {
    alignSelf: "flex-start",
    backgroundColor: "#FFC701",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 0,
  },
  routeButtonText: { color: "#000", fontWeight: "600", fontSize: 14 },
});

export default ActsRulesIndexScreen;
