import { StatusBar } from "expo-status-bar";
import React from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../src/components/ui/BlueHeader";
import Button from "../src/components/ui/Button";
import Card from "../src/components/ui/Card";
import { useAppSelector } from "../src/store";

const LandmarkJudgementsScreen: React.FC = () => {
  const theme = useAppSelector((s) => s.app.theme);
  const containerStyle = [
    styles.container,
    theme === "dark" && styles.darkContainer,
  ];

  return (
    <SafeAreaView style={containerStyle} edges={["top"]}>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='Landmark Judgements' />
      <View style={styles.scrollView}>
        <View style={styles.mainContent}>
          <View style={styles.content}>
            <Card style={styles.card}>
              <Text style={styles.title}>
                Landmark Judgements of H'nble High Court of J&K
              </Text>
              <Text style={styles.desc}>
                Landmark Judgements of the Hon'ble High Court of J&K are
                significant rulings that set important legal precedents and
                guide the interpretation of law in the Union Territory.
              </Text>
              <Button
                title='Explore More'
                onPress={() =>
                  Linking.openURL(
                    "https://www.jkhighcourt.nic.in/landmark-judgements"
                  )
                }
                style={styles.exploreButton}
                textStyle={styles.exploreButtonText}
              />
            </Card>

            <Card style={styles.card}>
              <Text style={styles.title}>
                Landmark Judgements of H'nble Supreme Court of India
              </Text>
              <Text style={styles.desc}>
                Landmark Judgements of the Hon'ble Supreme Court of J&K are
                significant rulings that set important legal precedents and
                guide the interpretation of law in the Union Territory.
              </Text>
              <Button
                title='Explore More'
                onPress={() =>
                  Linking.openURL(
                    "https://www.sci.gov.in/landmark-judgment-summaries/"
                  )
                }
                style={styles.exploreButton}
                textStyle={styles.exploreButtonText}
              />
            </Card>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E3A8A" },
  darkContainer: { backgroundColor: "#000000" },
  scrollView: { flex: 1, backgroundColor: "#1E3A8A" },
  mainContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    flex: 1,
  },
  content: { padding: 16 },
  card: { marginBottom: 12, padding: 12 },
  title: { fontSize: 14, fontWeight: "700", marginBottom: 8 },
  desc: { fontSize: 12, color: "#111827", marginBottom: 12 },
  // Match Legal Aid explore button styles
  exploreButton: {
    alignSelf: "flex-start",
    backgroundColor: "#FFC701",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 0,
  },
  exploreButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default LandmarkJudgementsScreen;
