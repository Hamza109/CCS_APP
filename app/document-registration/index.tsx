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

const DocumentRegistrationScreen: React.FC = () => {
  const theme = useAppSelector((state) => state.app.theme);

  const data = [
    {
      id: "process",
      title: "Process of Registration",
      desc: "The official procedure of recording ownership, rights, or interests in a piece of land with the government or land registry.",
    },
    {
      id: "registrars-jammu",
      title: "Offices of Registrars & Sub Registrars of Jammu Division",
      desc: "Government offices responsible for the registration of property, land, and related legal documents within the Jammu Division.",
    },
    {
      id: "registrars-kashmir",
      title: "Offices of Registrars & Sub Registrars of Kashmir Division",
      desc: "Government offices responsible for the registration of property, land, and related legal documents within the Kashmir Division.",
    },
    {
      id: "model-templates",
      title: "Model Templates",
      desc: "List for legal and property-related deeds and agreements, formatted like you requested.",
    },
    {
      id: "stamp-vendors",
      title: "List of Stamp Vendors",
      desc: "Authorized vendors from whom stamp papers can be purchased for legal and property-related transactions.",
    },
    {
      id: "checklist-documents",
      title: "Checklist of Documents",
      desc: "A ready reference of all documents required for a specific legal or registration process.",
    },
    {
      id: "faq",
      title: "Frequently Asked Questions",
      desc: "Clear and authoritative answers to common queries related to land and property registration.",
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
            case "process":
              router.push(ROUTES.DOCUMENT_REGISTRATION.PROCESS as any);
              break;
            case "registrars-jammu":
              router.push(ROUTES.DOCUMENT_REGISTRATION.REGISTRARS_JAMMU as any);
              break;
            case "registrars-kashmir":
              router.push(
                ROUTES.DOCUMENT_REGISTRATION.REGISTRARS_KASHMIR as any
              );
              break;
            case "model-templates":
              router.push(ROUTES.DOCUMENT_REGISTRATION.MODEL_TEMPLATES as any);
              break;
            case "stamp-vendors":
              router.push(ROUTES.DOCUMENT_REGISTRATION.STAMP_VENDORS as any);
              break;
            case "checklist-documents":
              Linking.openURL(
                "https://ngdrs.jk.gov.in/NGDRS_JK/Documentation/checklist_of_documents.pdf"
              );
              break;
            case "faq":
              router.push(ROUTES.DOCUMENT_REGISTRATION.FAQ as any);
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
      <BlueHeader title='Document Registration' />
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

export default DocumentRegistrationScreen;
