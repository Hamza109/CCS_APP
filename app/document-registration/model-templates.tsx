import { FontAwesome } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Card from "../../src/components/ui/Card";
import { modelTemplatesData } from "../../src/data/modelTemplates";

const FILE_BASE_URL = "http://10.149.13.209/ccsproject/";

const ModelTemplatesScreen: React.FC = () => {
  const data = modelTemplatesData.templates;

  const openFile = (filePath: string) =>
    Linking.openURL(FILE_BASE_URL + filePath);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader
        title={modelTemplatesData.title}
        subtitle={modelTemplatesData.description}
      />

      <View style={styles.mainContent}>
        <FlashList
          data={data}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.templateName}>{item.name}</Text>
                </View>
                <Pressable
                  style={styles.downloadIconButton}
                  onPress={() => openFile(item.file_url)}
                >
                  <FontAwesome name='download' size={22} color='#1E3A8A' />
                </Pressable>
              </View>
            </Card>
          )}
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
  card: { marginBottom: 12, paddingHorizontal: 16, paddingVertical: 16 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  templateName: { fontSize: 14, color: "#0F172A", fontWeight: "600" },
  downloadIconButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
});

export default ModelTemplatesScreen;
