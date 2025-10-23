import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";
import { ROUTES } from "../../src/constants/routes";
import { useAppSelector } from "../../src/store";

const ListNotariesScreen: React.FC = () => {
  const theme = useAppSelector((state) => state.app.theme);

  const data = [
    {
      id: "notaries",
      title: "List of Notaries",
      desc: "Compilation of all registered notary publics, including their names, contact details, and jurisdictions where they are authorized to provide notarial services.",
    },
    {
      id: "oath-commissioners",
      title: "List of Oath Commissioners",
      desc: "Officials authorized to administer oaths and affirmations, including their names, contact details, and jurisdictions.",
    },
    {
      id: "advocates",
      title: "List of Advocates",
      desc: "Directory of registered legal practitioners, including enrollment details, contact information, and areas of practice.",
    },
    {
      id: "govt-advocates",
      title: "List of Govt. Advocates",
      desc: "Compilation of lawyers appointed by the government to represent it in legal matters, including names, contact details, and designated offices.",
    },
    {
      id: "standing-counsels",
      title: "List of Standing Counsels",
      desc: "Directory of lawyers appointed by the government/institutions to represent them regularly in legal matters, with names, contact details, and areas of assignment.",
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
          if (item.id === "notaries")
            router.push(ROUTES.ADVOCATES.NOTARIES as any);
          if (item.id === "advocates")
            router.push(ROUTES.ADVOCATES.ADVOCATES as any);
          if (item.id === "govt-advocates")
            router.push(ROUTES.ADVOCATES.LAW_OFFICERS as any);
          if (item.id === "standing-counsels")
            router.push(ROUTES.ADVOCATES.STANDING_COUNSELS as any);
        }}
        style={styles.exploreButton}
        textStyle={styles.exploreButtonText}
      />
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='List of Notaries, Oath Commissioners, Govt. Advocates & Standing Counsels' />
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
  searchContainer: { paddingHorizontal: 16, paddingTop: 8 },
  searchTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },
  searchLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
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
  listContent: { paddingBottom: 24 },
  itemCard: { marginBottom: 12, paddingHorizontal: 16, paddingVertical: 16 },
  itemTitle: { fontSize: 14, fontWeight: "700", color: "#0F172A" },
  itemMeta: { fontSize: 13, color: "#374151" },
  emptyState: { paddingVertical: 24, alignItems: "center" },
  emptyText: { color: "#6B7280" },
});

export default ListNotariesScreen;
