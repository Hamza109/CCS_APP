import { FlashList } from "@shopify/flash-list";
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

const LawEducationScreen: React.FC = () => {
  const theme = useAppSelector((state) => state.app.theme);

  const data = [
    {
      id: "expert-guidance",
      title: "Guidance through expert from Law Department",
      desc: "Guidance through Expert from Law Department enables users to consult qualified legal experts for advice, clarifications, and assistance on legal matters.",
    },
    {
      id: "national-law-universities",
      title: "List of all National Law Universities",
      desc: "The module List of all National Law Universities provides the names of all National Law Universities in India along with their official website links for direct access.",
    },
    {
      id: "local-universities",
      title: "Local Universities/Colleges offering courses in law",
      desc: "The module Local Universities/Colleges offering courses in law provides information on regional institutions that offer law programs, including course details, eligibility, and contact information.",
    },
    {
      id: "specialised-courses",
      title: "Specialised Courses in Law",
      desc: "The module Specialised Courses in Law provides information on advanced and focused legal programs, detailing areas of specialization, course structure, and eligibility criteria.",
    },
    {
      id: "how-to-apply",
      title: "How to apply and when to apply",
      desc: "The module How to Apply and When to Apply guides users on the application process, required documents, eligibility, and important deadlines for courses, programs, or services.",
    },
    {
      id: "scholarships",
      title: "Scholarships and Financial Aid",
      desc: "Information about scholarships, grants, and financial assistance programs available for law students to support their education and career development.",
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
            case "expert-guidance":
              router.push(ROUTES.LAW_EDUCATION.EXPERT_GUIDANCE);
              break;
            case "national-law-universities":
              router.push(ROUTES.LAW_EDUCATION.NATIONAL_LAW_UNIVERSITIES);
              break;
            case "local-universities":
              router.push(ROUTES.LAW_EDUCATION.LOCAL_UNIVERSITIES);
              break;
            case "specialised-courses":
              router.push(ROUTES.LAW_EDUCATION.SPECIALISED_COURSES);
              break;
            case "how-to-apply":
              router.push(ROUTES.LAW_EDUCATION.HOW_TO_APPLY);
              break;
            case "scholarships":
              router.push(ROUTES.LAW_EDUCATION.SCHOLARSHIPS);
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
        title='Law Education'
        subtitle='Universities, Courses, and Guidance Articles'
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

export default LawEducationScreen;
