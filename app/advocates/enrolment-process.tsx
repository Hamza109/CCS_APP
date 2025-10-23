import { FontAwesome } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Card from "../../src/components/ui/Card";
import { advocatesEnrolmentContent } from "../../src/data/advocatesEnrolment";

const FILE_BASE_URL = "http://10.149.13.209/ccsproject/";

type Item =
  | { type: "intro"; title: string; description: string }
  | {
      type: "downloads";
      title: string;
      files: { label: string; url: string }[];
    }
  | { type: "section"; heading: string; steps: string[] };

const EnrolmentProcessScreen: React.FC = () => {
  const items: Item[] = [
    {
      type: "intro",
      title: advocatesEnrolmentContent.title,
      description: advocatesEnrolmentContent.description,
    },
    {
      type: "downloads",
      title: advocatesEnrolmentContent.downloads.title,
      files: advocatesEnrolmentContent.downloads.files,
    },
    ...advocatesEnrolmentContent.sections.map(
      (s) => ({ type: "section", heading: s.heading, steps: s.steps } as Item)
    ),
  ];

  const openFile = (path: string) => Linking.openURL(FILE_BASE_URL + path);

  const renderItem = ({ item }: { item: Item }) => {
    if (item.type === "intro") {
      return (
        <Card style={styles.sectionCard}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </Card>
      );
    }
    if (item.type === "downloads") {
      return (
        <Card style={styles.sectionCard}>
          <View style={styles.infoCardHeader}>
            <View style={styles.infoCardAccent} />
            <Text style={styles.sectionHeading}>{item.title}</Text>
          </View>
          <View style={styles.downloadsGroup}>
            {item.files.map((f, idx) => (
              <View key={`${f.label}-${idx}`} style={styles.downloadRow}>
                <Text style={styles.downloadLabel}>{f.label}</Text>
                <Pressable
                  style={styles.downloadIconButton}
                  onPress={() => openFile(f.url)}
                >
                  <FontAwesome name='download' size={22} color='#1E3A8A' />
                </Pressable>
              </View>
            ))}
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
          {item.steps.map((s, idx) => (
            <Text key={idx} style={styles.stepText}>
              {idx + 1}. {s}
            </Text>
          ))}
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='Enrolment Process' />
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
  downloadsGroup: { marginTop: 8, gap: 10 },
  downloadRow: {
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
  stepsGroup: { marginTop: 8, gap: 6 },
  stepText: { color: "#111827", fontSize: 14 },
});

export default EnrolmentProcessScreen;
