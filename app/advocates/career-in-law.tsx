import { FontAwesome } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Card from "../../src/components/ui/Card";
import { careerInLawData } from "../../src/data/careerInLaw";

const CareerInLawScreen: React.FC = () => {
  const data = careerInLawData.career_in_law;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='Career in Law' />
      <View style={styles.mainContent}>
        <FlashList
          data={data}
          keyExtractor={(item) => String(item.s_no)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.bottomRow}>
                <Text style={styles.date}>{item.date}</Text>
                <Pressable
                  accessibilityRole='button'
                  onPress={() => Linking.openURL(item.download_url)}
                  style={styles.downloadIconButton}
                >
                  <FontAwesome name='download' size={22} color='#1E3A8A' />
                </Pressable>
              </View>
            </Card>
          )}
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
  listContent: { paddingHorizontal: 20, paddingBottom: 24 },
  card: { marginBottom: 12, paddingHorizontal: 16, paddingVertical: 16 },
  title: { fontSize: 14, color: "#0F172A", fontWeight: "600", marginBottom: 8 },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  date: { fontSize: 12, color: "#6B7280" },
  downloadIconButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
});

export default CareerInLawScreen;
