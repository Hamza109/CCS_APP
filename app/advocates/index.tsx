import { FlashList } from "@shopify/flash-list";
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

const AdvocatesScreen: React.FC = () => {
  const theme = useAppSelector((state) => state.app.theme);

  const data = [
    {
      id: "enrolment-process",
      title: "Enrolment Process",
      desc: "Enrolment Process refers to the step-by-step procedure through which individuals register or officially join a course, program, or service.",
    },
    {
      id: "welfare-schemes",
      title: "Welfare Schemes",
      desc: "Government/Institutional programs designed to provide social, economic, or legal support and benefits to eligible individuals or communities.",
    },
    {
      id: "notary-services",
      title: "Notary Services",
      desc: "Official services offered by a notary public such as attesting, certifying, and authenticating documents for legal purposes.",
    },
    {
      id: "list-notaries",
      title:
        "List of Notaries, Oath Commissioners, Govt. Advocates & Standing Counsels",
      desc: "Names, contact details, and official information of legal professionals authorized to perform notarial, oath-taking, and government legal services.",
    },
    {
      id: "career-in-law",
      title: "Career in Law",
      desc: "Professional opportunities and pathways: roles as lawyers, judges, legal advisors, academicians, and legal researchers.",
    },
    {
      id: "counsel-fee",
      title: "Government Advocates Counsel Fee",
      desc: "Remuneration/payment structure provided to government-appointed lawyers for representing the government.",
    },
    {
      id: "ecourt-fee-branches",
      title: "List of e-Court Fee Branches",
      desc: "Directory of designated branches authorized to collect electronic court fee payments for judicial cases.",
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
            case "enrolment-process":
              router.push(ROUTES.ADVOCATES.ENROLMENT_PROCESS as any);
              break;
            case "welfare-schemes":
              router.push(ROUTES.ADVOCATES.WELFARE_SCHEMES as any);
              break;
            case "notary-services":
              router.push(ROUTES.ADVOCATES.NOTARY_SERVICES as any);
              break;
            case "list-notaries":
              router.push(ROUTES.ADVOCATES.LIST_NOTARIES as any);
              break;
            case "career-in-law":
              router.push(ROUTES.ADVOCATES.CAREER_IN_LAW as any);
              break;
            case "counsel-fee":
              Linking.openURL("https://jklawcfp.jk.gov.in/");
              break;
            case "ecourt-fee-branches":
              router.push(ROUTES.ADVOCATES.ECOURT_FEE_BRANCHES as any);
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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='Advocates' />
      <View style={styles.mainContent}>
        <FlashList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flashListContent}
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
  darkText: { color: "#FFFFFF" },
  darkSubtext: { color: "#8E8E93" },
  flashListContent: { paddingHorizontal: 20, paddingBottom: 24 },
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
  infoCardVertical: { marginBottom: 12, padding: 16 },
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

export default AdvocatesScreen;
