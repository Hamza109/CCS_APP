import { FlashList } from "@shopify/flash-list";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";
import { useMLAs } from "../../src/hooks/useMLAs";
import { MLA } from "../../src/services/mlaApi";
import { useAppSelector } from "../../src/store";

const MlaListScreen: React.FC = () => {
  const theme = useAppSelector((state) => state.app.theme);
  const { data: mlas, isLoading, error } = useMLAs();

  const handleCall = (mobileNo: string) => {
    Linking.openURL(`tel:${mobileNo}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const renderMLACard = ({ item }: { item: MLA }) => (
    <Card style={styles.mlaCard}>
      <View style={styles.mlaHeader}>
        <Text style={[styles.mlaName, theme === "dark" && styles.darkText]}>
          {item.name}
        </Text>
      </View>

      <View style={styles.mlaInfoRow}>
        <View style={styles.infoItem}>
          <Text
            style={[styles.infoLabel, theme === "dark" && styles.darkSubtext]}
          >
            Constituency:
          </Text>
          <Text style={[styles.infoValue, theme === "dark" && styles.darkText]}>
            {item.constituency}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text
            style={[styles.infoLabel, theme === "dark" && styles.darkSubtext]}
          >
            Mobile:
          </Text>
          <Text style={[styles.infoValue, theme === "dark" && styles.darkText]}>
            {item.mobile_no}
          </Text>
        </View>
      </View>

      {item.address && (
        <View style={styles.addressContainer}>
          <Text
            style={[styles.infoLabel, theme === "dark" && styles.darkSubtext]}
          >
            Address:
          </Text>
          <Text
            style={[styles.address, theme === "dark" && styles.darkSubtext]}
          >
            {item.address}
          </Text>
        </View>
      )}

      <View style={styles.contactRow}>
        <Button
          title='Call'
          onPress={() => handleCall(item.mobile_no)}
          style={styles.contactButton}
          textStyle={styles.contactButtonText}
        />
        <Button
          title='Email'
          onPress={() => handleEmail(item.email)}
          style={styles.contactButton}
          textStyle={styles.contactButtonText}
        />
      </View>
    </Card>
  );

  return (
    <SafeAreaView
      style={[styles.container, theme === "dark" && styles.darkContainer]}
      edges={["top"]}
    >
      <StatusBar style='light' backgroundColor='#1E3A8A' />

      <BlueHeader
        title='List of MLAs with Contact details'
        subtitle='Access information about elected representatives'
      />

      <View style={styles.scrollView}>
        <View style={styles.mainContent}>
          {isLoading ? (
            <View style={styles.centerContainer}>
              <Text
                style={[
                  styles.loadingText,
                  theme === "dark" && styles.darkText,
                ]}
              >
                Loading MLAs...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.centerContainer}>
              <Text
                style={[styles.errorText, theme === "dark" && styles.darkText]}
              >
                Failed to load MLAs. Please try again.
              </Text>
            </View>
          ) : mlas && Array.isArray(mlas) && mlas.length > 0 ? (
            <FlashList
              data={mlas}
              renderItem={renderMLACard}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.flashListContent}
            />
          ) : (
            <View style={styles.centerContainer}>
              <Text
                style={[styles.noDataText, theme === "dark" && styles.darkText]}
              >
                No MLAs found
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E3A8A",
  },
  darkContainer: {
    backgroundColor: "#000000",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#1E3A8A",
  },
  mainContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    flex: 1,
  },
  flashListContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#FF6B6B",
    textAlign: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  darkText: {
    color: "#FFFFFF",
  },
  darkSubtext: {
    color: "#8E8E93",
  },
  // MLA Card styles
  mlaCard: {
    marginBottom: 12,
    padding: 16,
  },
  mlaHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  mlaName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
    marginRight: 8,
  },
  mlaInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 16,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  addressContainer: {
    marginBottom: 8,
  },
  address: {
    fontSize: 13,
    color: "#6B7280",
    fontStyle: "italic",
  },
  contactRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  contactButton: {
    backgroundColor: "#1E3A8A",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flex: 1,
  },
  contactButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default MlaListScreen;
