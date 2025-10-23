import { FontAwesome } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Card from "../../src/components/ui/Card";
import { anandMarriageActContent } from "../../src/data/anandMarriageAct";

const FILE_BASE_URL = "http://10.149.13.209/ccsproject/";

const AnandMarriageActScreen: React.FC = () => {
  const sections = anandMarriageActContent.sections;

  const handleOpenFile = (path: string) => {
    const url = FILE_BASE_URL + path;
    Linking.openURL(url);
  };

  const renderItem = ({ item }: { item: (typeof sections)[number] }) => (
    <Card style={styles.sectionCard}>
      <View style={styles.infoCardHeader}>
        <View style={styles.infoCardAccent} />
        <Text style={styles.sectionHeading}>{item.heading}</Text>
      </View>
      <Text style={styles.sectionDesc}>{item.description}</Text>

      {item.downloads && item.downloads.length ? (
        <View style={styles.downloadsGroup}>
          {item.downloads.map((d, idx) => (
            <View key={`${d.label}-${idx}`} style={styles.downloadRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.downloadLabel}>{d.label}</Text>
                {d.language ? (
                  <Text style={styles.downloadLang}>{d.language}</Text>
                ) : null}
              </View>
              <Pressable
                accessibilityRole='button'
                onPress={() => handleOpenFile(d.file_url)}
                style={styles.downloadIconButton}
              >
                <FontAwesome name='download' size={22} color='#1E3A8A' />
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}

      {item.steps && item.steps.length ? (
        <View style={styles.stepsGroup}>
          {item.steps.map((s, idx) => (
            <Text key={idx} style={styles.stepText}>
              {idx + 1}. {s}
            </Text>
          ))}
        </View>
      ) : null}

      {item.reference ? (
        <View style={styles.referenceGroup}>
          <Text style={styles.referenceText}>
            For more details, refer to the official{" "}
          </Text>
          <Pressable onPress={() => Linking.openURL(item.reference!.url)}>
            <Text style={styles.referenceLink}>{item.reference.label}</Text>
          </Pressable>
          <Text style={styles.referenceText}>.</Text>
        </View>
      ) : null}
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title={anandMarriageActContent.title} />
      <View style={styles.mainContent}>
        <FlashList
          data={sections}
          renderItem={renderItem}
          keyExtractor={(section, index) => section.heading + String(index)}
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
  downloadsGroup: { marginTop: 8, gap: 10 },
  downloadRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  downloadLabel: { fontSize: 14, fontWeight: "600", color: "#0F172A" },
  downloadLang: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  downloadIconButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
  stepsGroup: { marginTop: 8, gap: 6 },
  stepText: { color: "#111827", fontSize: 14 },
  referenceGroup: { marginTop: 12, flexDirection: "row", flexWrap: "wrap" },
  referenceText: { fontSize: 14, color: "#111827", marginBottom: 4 },
  referenceLink: {
    fontSize: 14,
    color: "#0EA5E9",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});

export default AnandMarriageActScreen;
