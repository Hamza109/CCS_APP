import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Dimensions, Linking, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";
import { ROUTES } from "../../src/constants/routes";
import { useAppSelector } from "../../src/store";

const { width } = Dimensions.get("window");

const LegislativeAssemblyScreen: React.FC = () => {
  const theme = useAppSelector((state) => state.app.theme);

  const data = [
    {
      id: "mla-list",
      title: "List of MLA's with Contact details",
      desc: "The module of List of MLA's with Contact details enables citizens to access information about elected representatives along with their communication details in one place.",
    },
    {
      id: "qa-session",
      title: "Q and A in Legislative Assembly",
      desc: "Q and A in the Legislative Assembly refers to the session where members ask questions and receive answers from the government on public issues and governance matters.",
    },
    {
      id: "committee-reports",
      title: "Committee Reports",
      desc: "Committee Reports are official documents presenting the findings, recommendations, and observations of legislative or parliamentary committees on specific issues or subjects.",
    },
    {
      id: "legislative-business",
      title: "Legislative Business",
      desc: "Legislative Business refers to all official activities, proceedings, and matters conducted in a legislature, including debates, bills, motions, and resolutions.",
    },
    {
      id: "live-proceedings",
      title: "Live Proceedings Link",
      desc: "Live Proceedings link for legal help provides real-time access to ongoing court or legislative sessions, enabling users to follow hearings, debates, or discussions relevant to legal matters.",
    },
    {
      id: "public-opinion",
      title: "Public Opinion on Draft Legislations",
      desc: "Public opinion on draft legislations refers to feedback, suggestions, and comments collected from citizens regarding proposed laws before they are finalized.",
    },
  ];

  const renderItem = ({
    item,
  }: {
    item: { id: string; title: string; desc: string };
  }) => (
    <Card style={styles.infoCardVertical}>
      <View style={styles.infoCardHeader}>
        <View style={styles.infoCardAccent} />
        <Text
          style={[styles.infoCardTitle, theme === "dark" && styles.darkText]}
        >
          {item.title}
        </Text>
      </View>
      <Text
        style={[styles.infoCardDesc, theme === "dark" && styles.darkSubtext]}
      >
        {item.desc}
      </Text>
      <Button
        title='Explore More'
        onPress={() => {
          switch (item.id) {
            case "mla-list":
              router.push(ROUTES.LEGISLATIVE_ASSEMBLY.MLA_LIST);
              break;
            case "qa-session":
              Linking.openURL("https://jkla.neva.gov.in/Home/NeVA");
              break;
            case "committee-reports":
              router.push(ROUTES.LEGISLATIVE_ASSEMBLY.COMMITTEE_REPORTS);
              break;
            case "legislative-business":
              Linking.openURL("https://jkla.neva.gov.in/Home/NeVA");
              break;
            case "live-proceedings":
              router.push(ROUTES.LEGISLATIVE_ASSEMBLY.LIVE_PROCEEDINGS);
              break;
            case "public-opinion":
              router.push(ROUTES.LEGISLATIVE_ASSEMBLY.PUBLIC_OPINION);
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
        title='Legislative Assembly'
        subtitle='MLAs, Committees, Reports, and Live Proceedings'
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
  infoCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    flexShrink: 1,
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

export default LegislativeAssemblyScreen;
