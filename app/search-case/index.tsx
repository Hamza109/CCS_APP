import { FlashList } from "@shopify/flash-list";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";
import { ROUTES } from "../../src/constants/routes";
import { useAppSelector } from "../../src/store";

const { width } = Dimensions.get("window");

const SearchCaseScreen: React.FC = () => {
  const theme = useAppSelector((state) => state.app.theme);

  const data = [
    {
      id: "supreme-court",
      title: "Hon'ble Supreme Court Cases",
      desc: "Search your own case status in the Hon'ble Supreme Court means tracking the current stage, hearings, and orders of your case from the Court's official records.",
      image: "🏛️",
    },
    {
      id: "high-court",
      title: "Hon'ble High Court Cases",
      desc: "Search your own case status in the Hon'ble High Court means tracking the current stage, hearings, and orders of your case from the Court's official records.",
      image: "⚖️",
    },
    {
      id: "district-court",
      title: "District Courts Cases",
      desc: "Search your own case status in the District Court means tracking the current stage, hearings, and orders of your case from the Court's official records.",
      image: "🏢",
    },
    {
      id: "cat-cases",
      title: "Central Administrative Tribunal (CAT) Cases",
      desc: "Search your own case status in the CAT means tracking the current stage, hearings, and orders of your case from the Court's official records.",
      image: "📋",
    },
    {
      id: "fcr-court",
      title: "FCR Court Cases",
      desc: "Search your own case status in FCR Court means checking the progress, hearings, and orders of your case from the records of the Financial Commissioner (Revenue) Court.",
      image: "💰",
    },
    {
      id: "landmark-judgements",
      title: "Landmark Judgements",
      desc: "Landmark Judgements are significant court rulings that establish new legal principles or set important precedents in law.",
      image: "📜",
    },
  ];

  const renderItem = ({
    item,
  }: {
    item: { id: string; title: string; desc: string; image: string };
  }) => (
    <Card style={styles.infoCardVertical}>
      <View style={styles.infoCardHeader}>
        <View style={styles.infoCardAccent} />
        <View style={styles.titleContainer}>
          <Text style={styles.titleImage}>{item.image}</Text>
          <Text
            style={[styles.infoCardTitle, theme === "dark" && styles.darkText]}
          >
            {item.title}
          </Text>
        </View>
      </View>
      <Text
        style={[styles.infoCardDesc, theme === "dark" && styles.darkSubtext]}
      >
        {item.desc}
      </Text>
      <Button
        title='Explore More'
        onPress={() => {
          // Handle navigation for each case type
          switch (item.id) {
            case "supreme-court":
              Linking.openURL("https://sci.gov.in/case-status-case-no/");
              break;
            case "high-court":
              router.push(ROUTES.SEARCH_CASE.HIGH_COURT_SEARCH);
              break;
            case "district-court":
              router.push(ROUTES.SEARCH_CASE.DISTRICT_COURT_SEARCH);
              break;
            case "cat-cases":
              router.push(ROUTES.SEARCH_CASE.CAT_SEARCH);
              break;
            case "fcr-court":
              router.push(ROUTES.SEARCH_CASE.FCR_COURT_SEARCH);
              break;
            case "landmark-judgements":
              router.push(ROUTES.LANDMARK_JUDGEMENTS);
              break;
            default:
              break;
          }
        }}
        style={styles.exploreButton}
        textStyle={styles.exploreButtonText}
      />
    </Card>
  );

  return (
    <SafeAreaView
      style={[styles.container, theme === "dark" && styles.darkContainer]}
      edges={["top"]}
    >
      <StatusBar style='light' backgroundColor='#1E3A8A' />

      {/* Blue Header */}
      <BlueHeader
        title='Search your case'
        subtitle='Track your case status across different courts'
      />

      {/* Main Content */}
      <View style={styles.scrollView}>
        <View style={styles.mainContent}>
          <FlashList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flashListContent}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Main Containers
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

  darkText: {
    color: "#FFFFFF",
  },
  darkSubtext: {
    color: "#8E8E93",
  },

  flashListContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  // Card styles
  infoCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoCardAccent: {
    width: 3,
    height: 20,
    backgroundColor: "#007AFF",
    borderRadius: 2,
    marginRight: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  titleImage: {
    fontSize: 24,
    marginRight: 12,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    flexShrink: 1,
    flex: 1,
  },
  infoCardDesc: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 6,
    marginBottom: 12,
  },
  infoCardVertical: {
    marginBottom: 12,
    padding: 16,
  },

  // Explore button styles
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

export default SearchCaseScreen;
