import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Card from "../../src/components/ui/Card";
import { useCatCaseDetails } from "../../src/hooks/useCat";
import { useAppSelector } from "../../src/store";

const CatResultScreen: React.FC = () => {
  const theme = useAppSelector((s) => s.app.theme);
  const { location, caseType, caseNo, caseYear } = useLocalSearchParams<{
    location?: string;
    caseType?: string;
    caseNo?: string;
    caseYear?: string;
  }>();

  const params =
    location && caseType && caseNo && caseYear
      ? {
          caseNo: String(caseNo),
          caseYear: String(caseYear),
          caseType: String(caseType),
          location: String(location),
        }
      : undefined;

  const { data, isLoading, error } = useCatCaseDetails(params);
  const msg: any = data?.message;

  useEffect(() => {
    if (data) {
      console.log("CAT API Response:", data);
    }
  }, [data]);

  const containerStyle = [
    styles.container,
    theme === "dark" && styles.darkContainer,
  ];

  const renderRow = (label: string, value?: string | number | null) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={2}>
        {value ? String(value) : "-"}
      </Text>
    </View>
  );

  const renderCodeRow = (label: string, value?: string | number | null) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.code} numberOfLines={1}>
        {value ? String(value) : "-"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={containerStyle} edges={["top"]}>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='CAT Case Results' />
      <View style={styles.scrollView}>
        <View style={styles.mainContent}>
          <ScrollView contentContainerStyle={styles.content}>
            {isLoading && (
              <Card style={styles.card}>
                <Text>Loading...</Text>
              </Card>
            )}

            {error && (
              <Card style={styles.card}>
                <Text style={styles.error}>
                  Error: {(error as any)?.message || "Something went wrong"}
                </Text>
              </Card>
            )}

            {data && (
              <>
                {/* Case Details */}
                <Card style={styles.card}>
                  <Text style={styles.title}>Case Details</Text>
                  {renderRow("Case Title", msg?.casetitle)}
                  {renderRow("Subject", msg?.subject)}
                  {renderRow("Wing", msg?.wing)}
                  {renderRow("Filing No", msg?.filing_no)}
                  {renderRow("Filing Date", msg?.dt_of_filing)}
                  {renderRow(
                    "Status",
                    msg?.status === "D"
                      ? "Disposed"
                      : msg?.status === "P"
                      ? "Pending"
                      : msg?.status
                  )}
                  {renderRow("Next Hearing Date", msg?.nexthearingdate)}
                </Card>

                {/* Parties */}
                <Card style={styles.card}>
                  <Text style={styles.title}>Parties & Advocates</Text>
                  {renderRow("Petitioner", msg?.pet_name)}
                  {renderRow("Petitioner Advocate", msg?.pet_adv)}
                  {renderRow("Respondent", msg?.res_name)}
                  {renderRow("Respondent Advocate", msg?.res_adv)}
                </Card>

                {/* Orders */}
                {data.orders &&
                  Array.isArray(data.orders) &&
                  data.orders.length > 0 && (
                    <Card style={styles.card}>
                      <Text style={styles.title}>Orders</Text>
                      {data.orders.map((order: any, idx: number) => (
                        <View key={idx} style={styles.orderItem}>
                          {renderRow("Date", order.date)}
                          {renderRow("Order", order.order_text)}
                          {renderRow("Judge", order.judge_name)}
                        </View>
                      ))}
                    </Card>
                  )}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E3A8A" },
  darkContainer: { backgroundColor: "#000000" },
  scrollView: { flex: 1, backgroundColor: "#1E3A8A" },
  mainContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    flex: 1,
  },
  content: { padding: 16 },
  card: { marginBottom: 12, padding: 12 },
  title: { fontSize: 14, fontWeight: "700", marginBottom: 8 },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
    paddingVertical: 4,
  },
  label: {
    width: 130,
    fontSize: 12,
    color: "#6B7280",
  },
  value: {
    flex: 1,
    fontSize: 12,
    color: "#111827",
  },
  code: {
    flex: 1,
    fontSize: 12,
    color: "#111827",
    fontFamily: Platform.select({ ios: "Courier", android: "monospace" }),
  },
  error: { color: "#B00020" },
  jsonText: {
    fontFamily: Platform.select({ ios: "Courier", android: "monospace" }),
    fontSize: 10,
    color: "#111827",
  },
  orderItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    marginBottom: 8,
  },
});

export default CatResultScreen;
