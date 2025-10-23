import { FlashList } from "@shopify/flash-list";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";
import {
  nationalLawUniversities,
  NationalLawUniversity,
} from "../../src/data/nationalLawUniversities";
import { useAppSelector } from "../../src/store";

const NationalLawUniversitiesScreen: React.FC = () => {
  const theme = useAppSelector((state) => state.app.theme);

  const handleWebsitePress = (url: string) => {
    Linking.openURL(url);
  };

  const renderUniversityCard = ({ item }: { item: NationalLawUniversity }) => (
    <Card style={styles.universityCard}>
      <View style={styles.universityHeader}>
        <Text
          style={[styles.universityName, theme === "dark" && styles.darkText]}
        >
          {item.name}
        </Text>
      </View>

      <View style={styles.websiteContainer}>
        <Text
          style={[styles.websiteLabel, theme === "dark" && styles.darkSubtext]}
        >
          Website:
        </Text>
        <Text style={[styles.websiteUrl, theme === "dark" && styles.darkText]}>
          {item.url}
        </Text>
      </View>

      <Button
        title='Go to Website'
        onPress={() => handleWebsitePress(item.url)}
        style={styles.websiteButton}
        textStyle={styles.websiteButtonText}
      />
    </Card>
  );

  return (
    <SafeAreaView
      style={[styles.container, theme === "dark" && styles.darkContainer]}
      edges={["top"]}
    >
      <StatusBar style='light' backgroundColor='#1E3A8A' />

      <BlueHeader
        title='List of all National Law Universities'
        subtitle='National Law Universities with official website links'
      />

      <View style={styles.scrollView}>
        <View style={styles.mainContent}>
          <FlashList
            data={nationalLawUniversities}
            renderItem={renderUniversityCard}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.flashListContent}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E3A8A",
  },
  darkContainer: {
    backgroundColor: "#000000",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#1E3A8A",
  },
  mainContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    flex: 1,
  },
  flashListContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  darkText: {
    color: "#FFFFFF",
  },
  darkSubtext: {
    color: "#8E8E93",
  },
  // University Card styles
  universityCard: {
    marginBottom: 12,
    padding: 16,
  },
  universityHeader: {
    marginBottom: 12,
  },
  universityName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    lineHeight: 22,
  },
  websiteContainer: {
    marginBottom: 12,
  },
  websiteLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 4,
  },
  websiteUrl: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },
  websiteButton: {
    backgroundColor: "#1E3A8A",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: "flex-start",
  },
  websiteButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default NationalLawUniversitiesScreen;
