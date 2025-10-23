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

const MarriageRegistrationScreen: React.FC = () => {
  const theme = useAppSelector((state) => state.app.theme);

  const data = [
    {
      id: "hindu-marriage-act",
      title: "Hindu Marriage Act",
      desc: "An Indian law that regulates the marriage, divorce, and related matrimonial matters for Hindus, Buddhists, Jains, and Sikhs.",
    },
    {
      id: "special-marriage-act",
      title: "Special Marriage Act",
      desc: "Provides a civil marriage framework for all citizens, allowing individuals of different religions or faiths to marry legally.",
    },
    {
      id: "anand-marriage-act",
      title: "Anand Marriage Act",
      desc: "Governs registration and legal recognition of marriages among Sikhs according to the Anand Karaj ceremony.",
    },
    {
      id: "authority-locations",
      title: "Details of Marriage Registration Authority with office Location",
      desc: "The official office responsible for registering marriages and issuing certificates, located at district/tehsil/municipal offices.",
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
            case "hindu-marriage-act":
              router.push(
                ROUTES.MARRIAGE_REGISTRATION.HINDU_MARRIAGE_ACT as any
              );
              break;
            case "special-marriage-act":
              router.push(
                ROUTES.MARRIAGE_REGISTRATION.SPECIAL_MARRIAGE_ACT as any
              );
              break;
            case "anand-marriage-act":
              router.push(
                ROUTES.MARRIAGE_REGISTRATION.ANAND_MARRIAGE_ACT as any
              );
              break;
            case "authority-locations":
              router.push(
                ROUTES.MARRIAGE_REGISTRATION.AUTHORITY_LOCATIONS as any
              );
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
      <BlueHeader title='Registration of Marriage' />
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
  container: {
    flex: 1,
    backgroundColor: "#1E3A8A",
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
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

export default MarriageRegistrationScreen;
