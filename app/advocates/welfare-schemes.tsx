import { FontAwesome } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Card from "../../src/components/ui/Card";
import { advocatesWelfareContent } from "../../src/data/advocatesWelfare";

const FILE_BASE_URL = "http://10.149.13.209/ccsproject/";

const WelfareSchemesScreen: React.FC = () => {
  const data = advocatesWelfareContent.downloads;
  const openFile = (p: string) => Linking.openURL(FILE_BASE_URL + p);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader
        title={advocatesWelfareContent.title}
        subtitle={advocatesWelfareContent.description}
      />
      <View style={styles.mainContent}>
        <FlashList
          data={data}
          keyExtractor={(item, idx) => `${item.label}-${idx}`}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>{item.label}</Text>
                <Pressable
                  style={styles.downloadIconButton}
                  onPress={() => openFile(item.url)}
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
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "nowrap",
  },
  label: {
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
    flexShrink: 1,
  },
  downloadIconButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    alignSelf: "flex-start",
  },
});

export default WelfareSchemesScreen;
