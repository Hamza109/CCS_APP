import { FlashList } from "@shopify/flash-list";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Card from "../../src/components/ui/Card";
import {
  localUniversities,
  LocalUniversity,
} from "../../src/data/localUniversities";
import { useAppSelector } from "../../src/store";

const LocalUniversitiesScreen: React.FC = () => {
  const theme = useAppSelector((state) => state.app.theme);

  const renderUniversityCard = ({ item }: { item: LocalUniversity }) => (
    <Card style={styles.universityCard}>
      <View style={styles.universityHeader}>
        <Text
          style={[styles.universityName, theme === "dark" && styles.darkText]}
        >
          {item.name}
        </Text>
        <Text
          style={[
            styles.divisionTag,
            theme === "dark" && styles.darkDivisionTag,
          ]}
        >
          {item.division}
        </Text>
      </View>

      <View style={styles.addressContainer}>
        <Text
          style={[styles.addressLabel, theme === "dark" && styles.darkSubtext]}
        >
          Address:
        </Text>
        <Text
          style={[styles.addressValue, theme === "dark" && styles.darkText]}
        >
          {item.address}
        </Text>
      </View>
    </Card>
  );

  return (
    <SafeAreaView
      style={[styles.container, theme === "dark" && styles.darkContainer]}
      edges={["top"]}
    >
      <StatusBar style='light' backgroundColor='#1E3A8A' />

      <BlueHeader
        title='Local Universities/Colleges offering courses in law'
        subtitle='Regional institutions offering law programs'
      />

      <View style={styles.scrollView}>
        <View style={styles.mainContent}>
          <FlashList
            data={localUniversities}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  universityName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    lineHeight: 22,
    flex: 1,
    marginRight: 8,
  },
  divisionTag: {
    fontSize: 12,
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  darkDivisionTag: {
    color: "#8E8E93",
    backgroundColor: "#2C2C2E",
  },
  addressContainer: {
    marginBottom: 4,
  },
  addressLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 4,
  },
  addressValue: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
    lineHeight: 18,
  },
});

export default LocalUniversitiesScreen;
