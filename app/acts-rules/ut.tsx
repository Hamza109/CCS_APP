import { FontAwesome } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Card from "../../src/components/ui/Card";
import { UT_ACTS_DATA, UtActItem } from "../../src/data/utActs";
import { UT_RULES_DATA, UtRuleItem } from "../../src/data/utRules";
import { useAppSelector } from "../../src/store";

type TabKey = "rules" | "acts" | "notifications";

const UtActsScreen: React.FC = () => {
  const FILE_BASE_URL = "http://10.149.13.209/ccsproject/";
  const theme = useAppSelector((s) => s.app.theme);
  const [activeTab, setActiveTab] = React.useState<TabKey>("rules");

  return (
    <SafeAreaView
      style={[styles.container, theme === "dark" && styles.darkContainer]}
      edges={["top"]}
    >
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='J&K UT - Acts, Rules & Notifications' />

      <View style={styles.mainContent}>
        <View style={styles.content}>
          <View style={styles.tabsRow}>
            {(
              [
                { id: "rules", title: "Rules" },
                { id: "acts", title: "Acts" },
                { id: "notifications", title: "Notifications" },
              ] as { id: TabKey; title: string }[]
            ).map((t) => {
              const isActive = activeTab === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.tabButton, isActive && styles.tabButtonActive]}
                  onPress={() => setActiveTab(t.id)}
                >
                  <Text
                    style={[styles.tabText, isActive && styles.tabTextActive]}
                  >
                    {t.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {activeTab === "rules" && (
            <View style={{ flex: 1 }}>
              <FlashList
                data={UT_RULES_DATA}
                keyExtractor={(item: UtRuleItem) => String(item.id)}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }: { item: UtRuleItem }) => (
                  <Card style={styles.itemCard}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <TouchableOpacity
                        accessibilityRole='button'
                        onPress={() =>
                          Linking.openURL(FILE_BASE_URL + item.pdf_url)
                        }
                        style={styles.downloadIconButton}
                      >
                        <FontAwesome
                          name='download'
                          size={18}
                          color='#1E3A8A'
                        />
                      </TouchableOpacity>
                    </View>
                  </Card>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No Rules available</Text>
                  </View>
                }
              />
            </View>
          )}
          {activeTab === "acts" && (
            <View style={{ flex: 1 }}>
              <FlashList
                data={UT_ACTS_DATA}
                keyExtractor={(item: UtActItem) => String(item.s_no)}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }: { item: UtActItem }) => (
                  <Card style={styles.itemCard}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemBadge}>{item.year}</Text>
                      <TouchableOpacity
                        accessibilityRole='button'
                        onPress={() =>
                          Linking.openURL(FILE_BASE_URL + item.pdf_url)
                        }
                        style={styles.downloadIconButton}
                      >
                        <FontAwesome
                          name='download'
                          size={18}
                          color='#1E3A8A'
                        />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.itemMeta}>Serial No: {item.s_no}</Text>
                  </Card>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No Acts available</Text>
                  </View>
                }
              />
            </View>
          )}
          {activeTab === "notifications" && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No Notifications available</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E3A8A" },
  darkContainer: { backgroundColor: "#000000" },
  mainContent: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
  },
  content: { flex: 1, paddingHorizontal: 20, paddingBottom: 24 },
  listContent: { paddingHorizontal: 5, paddingBottom: 10, paddingTop: 10 },
  tabsRow: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: { fontSize: 14, color: "#6B7280", fontWeight: "600" },
  tabTextActive: { color: "#111827" },

  sectionCard: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  sectionDesc: { fontSize: 13, color: "#6B7280", marginTop: 6 },

  itemCard: { marginBottom: 12, padding: 16 },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
    marginRight: 8,
  },
  itemBadge: {
    fontSize: 12,
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  downloadIconButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    marginLeft: 8,
  },
  itemMeta: { fontSize: 12, color: "#6B7280" },
  emptyState: { paddingVertical: 40, alignItems: "center" },
  emptyText: { color: "#6B7280" },
});

export default UtActsScreen;
