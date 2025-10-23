import { FontAwesome } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Card from "../../src/components/ui/Card";
import { documentRegistrationProcess } from "../../src/data/documentRegistrationProcess";

const FILE_BASE_URL = "http://10.149.13.209/ccsproject/";

type Item =
  | { type: "intro"; title: string; description: string }
  | {
      type: "download";
      heading: string;
      description: string;
      label: string;
      url: string;
    }
  | {
      type: "steps";
      heading: string;
      steps: {
        step: number;
        title: string;
        description?: string;
        link?: string;
      }[];
    };

const ProcessScreen: React.FC = () => {
  const items: Item[] = [
    {
      type: "intro",
      title: documentRegistrationProcess.title,
      description: documentRegistrationProcess.description,
    },
    {
      type: "download",
      heading: documentRegistrationProcess.download_section.heading,
      description: documentRegistrationProcess.download_section.description,
      label: documentRegistrationProcess.download_section.file.label,
      url: documentRegistrationProcess.download_section.file.url,
    },
    {
      type: "steps",
      heading: documentRegistrationProcess.general_steps.heading,
      steps: documentRegistrationProcess.general_steps.steps,
    },
  ];

  const openFile = (path: string) => {
    Linking.openURL(FILE_BASE_URL + path);
  };

  const renderItem = ({ item }: { item: Item }) => {
    if (item.type === "intro") {
      return (
        <Card style={styles.sectionCard}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </Card>
      );
    }
    if (item.type === "download") {
      return (
        <Card style={styles.sectionCard}>
          <View style={styles.infoCardHeader}>
            <View style={styles.infoCardAccent} />
            <Text style={styles.sectionHeading}>{item.heading}</Text>
          </View>
          <Text style={styles.sectionDesc}>{item.description}</Text>
          <View style={styles.downloadRow}>
            <Text style={styles.downloadLabel}>{item.label}</Text>
            <Pressable
              accessibilityRole='button'
              onPress={() => openFile(item.url)}
              style={styles.downloadIconButton}
            >
              <FontAwesome name='download' size={22} color='#1E3A8A' />
            </Pressable>
          </View>
        </Card>
      );
    }
    return (
      <Card style={styles.sectionCard}>
        <View style={styles.infoCardHeader}>
          <View style={styles.infoCardAccent} />
          <Text style={styles.sectionHeading}>{item.heading}</Text>
        </View>
        <View style={styles.stepsGroup}>
          {item.steps.map((s) => (
            <View key={s.step} style={styles.stepRow}>
              <Text style={styles.stepNumber}>{s.step}.</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>{s.title}</Text>
                {s.description ? (
                  <Text style={styles.stepDescription}>{s.description}</Text>
                ) : null}
                {s.link ? (
                  <Pressable onPress={() => Linking.openURL(s.link!)}>
                    <Text style={styles.linkText}>{s.link}</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='Document Registration Guidelines' />
      <View style={styles.mainContent}>
        <FlashList
          data={items}
          renderItem={renderItem}
          keyExtractor={(_, idx) => String(idx)}
          contentContainerStyle={styles.listContent}
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
  title: { fontSize: 18, fontWeight: "700", color: "#0F172A", marginBottom: 6 },
  description: { fontSize: 14, color: "#6B7280" },
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
  sectionCard: { marginBottom: 12, padding: 16 },
  sectionHeading: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  sectionDesc: { marginTop: 6, color: "#6B7280", fontSize: 13 },
  downloadRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  downloadLabel: { fontSize: 14, fontWeight: "600", color: "#0F172A" },
  downloadIconButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
  stepsGroup: { marginTop: 8, gap: 10 },
  stepRow: { flexDirection: "row", gap: 8 },
  stepNumber: {
    fontSize: 14,
    color: "#1E3A8A",
    fontWeight: "700",
    width: 18,
    textAlign: "right",
  },
  stepTitle: { fontSize: 14, color: "#111827", fontWeight: "600" },
  stepDescription: { fontSize: 13, color: "#6B7280" },
  linkText: { fontSize: 13, color: "#0EA5E9", textDecorationLine: "underline" },
});

export default ProcessScreen;
