import { FontAwesome } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import { useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { StatusBar } from "expo-status-bar";
import he from "he";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Card from "../../src/components/ui/Card";
import { useHighCourtCaseDetails } from "../../src/hooks/useHighCourt";
import highCourtApi from "../../src/services/highCourtApi";
import { useAppSelector } from "../../src/store";

const HighCourtResultScreen: React.FC = () => {
  const theme = useAppSelector((s) => s.app.theme);
  const { est_code, case_type, reg_year, reg_no } = useLocalSearchParams<{
    est_code?: string;
    case_type?: string;
    reg_year?: string;
    reg_no?: string;
  }>();

  const params =
    est_code && case_type && reg_year && reg_no
      ? {
          est_code: String(est_code),
          case_type: String(case_type),
          reg_year: String(reg_year),
          reg_no: String(reg_no),
        }
      : undefined;

  const { data, isLoading, error } = useHighCourtCaseDetails(params);
  const [downloadingOrder, setDownloadingOrder] = useState<string | null>(null);

  useEffect(() => {
    if (data?.detail) {
      console.log("HighCourt getCaseDetails detail:", data.detail);
    }
  }, [data, error]);

  const containerStyle = [
    styles.container,
    theme === "dark" && styles.darkContainer,
  ];

  const firstCase = (() => {
    const casenos = data?.search?.casenos;
    if (!casenos) return undefined;
    const values = Object.values(casenos as any);
    return values?.[0] as any;
  })();

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

  const getStatusPill = (pendDisp?: string | null) => {
    const normalized = pendDisp ? String(pendDisp).toUpperCase() : "";
    const isPending = normalized === "P" || normalized === "PENDING";
    const isDisposed = normalized === "D" || normalized === "DISPOSED";
    const label = isPending
      ? "Pending"
      : isDisposed
      ? "Disposed"
      : normalized || "-";
    const pillStyle = [
      styles.pill,
      isPending && styles.pillPending,
      isDisposed && styles.pillDisposed,
    ];
    return (
      <View style={pillStyle}>
        <Text style={styles.pillText}>{label}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={containerStyle} edges={["top"]}>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='High Court Results' />
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

            {!!firstCase && (
              <Card style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.title}>Basic Case</Text>
                  {getStatusPill(data?.detail?.pend_disp)}
                </View>
                {renderCodeRow("CINO", firstCase?.cino)}
                {renderRow("Reg No", firstCase?.reg_no)}
                {renderRow("Reg Year", firstCase?.reg_year)}
              </Card>
            )}

            {!!data?.detail && (
              <>
                {/* Case Details */}
                <Card style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.title}>Case Details</Text>
                  </View>
                  {renderCodeRow("CINO", data.detail.cino)}
                  {renderRow("Case Type", data.detail.type_name_fil)}
                  {renderRow(
                    "Filing No/Year",
                    `${data.detail.fil_no || "-"} / ${
                      data.detail.fil_year || "-"
                    }`
                  )}
                  {renderRow(
                    "Reg No/Year",
                    `${data.detail.reg_no || "-"} / ${
                      data.detail.reg_year || "-"
                    }`
                  )}
                  {renderRow("Court", data.detail.court_est_name)}
                  {renderRow(
                    "State / District",
                    `${data.detail.state_name || "-"} / ${
                      data.detail.dist_name || "-"
                    }`
                  )}
                  {renderRow("Filing Date", data.detail.date_of_filing)}
                  {renderRow("Registration Date", data.detail.dt_regis)}
                </Card>

                {/* Case Status */}
                <Card style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.title}>Case Status</Text>
                    {getStatusPill(data.detail.pend_disp)}
                  </View>
                  {renderRow("First Hearing", data.detail.date_first_list)}
                  {renderRow("Next Hearing", data.detail.date_next_list)}
                  {renderRow(
                    "Purpose",
                    data.detail.purpose_name
                      ? he.decode(String(data.detail.purpose_name))
                      : "-"
                  )}
                  {renderRow(
                    "Coram",
                    data.detail.coram
                      ? he.decode(String(data.detail.coram))
                      : "-"
                  )}
                  {renderRow("Short Order", data.detail.short_order)}
                </Card>

                {/* Parties & Advocates */}
                <Card style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.title}>Parties & Advocates</Text>
                  </View>
                  {renderRow("Petitioner", data.detail.pet_name)}
                  {renderRow("Petitioner Advocate", data.detail.pet_adv)}
                  {renderRow("Respondent", data.detail.res_name)}
                  {renderRow("Respondent Advocate", data.detail.res_adv)}
                </Card>

                {/* Interim Orders */}
                {!!data.detail.interimorder && (
                  <Card style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.title}>Order Details</Text>
                    </View>
                    {Object.values<any>(data.detail.interimorder).map(
                      (ord: any, idx: number) => (
                        <View key={idx} style={styles.orderRow}>
                          <View style={{ flex: 1 }}>
                            {renderRow(
                              "Order",
                              `#${ord?.order_no || "-"} — ${
                                ord?.order_date || "-"
                              }`
                            )}
                          </View>
                          {!!(
                            data.detail.cino &&
                            ord?.order_no &&
                            ord?.order_date
                          ) && (
                            <View>
                              {downloadingOrder ===
                              `${String(ord.order_no)}_${String(
                                ord.order_date
                              )}` ? (
                                <ActivityIndicator
                                  size='small'
                                  color='#1E3A8A'
                                />
                              ) : (
                                <Text
                                  style={styles.downloadLink}
                                  onPress={async () => {
                                    const key = `${String(
                                      ord.order_no
                                    )}_${String(ord.order_date)}`;
                                    try {
                                      setDownloadingOrder(key);
                                      const { pdfBase64 } =
                                        await highCourtApi.getOrderDownloadUrl(
                                          String(data.detail.cino),
                                          String(ord.order_no),
                                          String(ord.order_date)
                                        );

                                      if (!pdfBase64) return;
                                      const fileUri = `${
                                        FileSystem.cacheDirectory
                                      }order_${String(ord.order_no)}.pdf`;
                                      await FileSystem.writeAsStringAsync(
                                        fileUri,
                                        pdfBase64,
                                        { encoding: "base64" }
                                      );
                                      if (await Sharing.isAvailableAsync()) {
                                        await Sharing.shareAsync(fileUri);
                                      } else {
                                        console.log("PDF saved at:", fileUri);
                                      }
                                    } catch (e) {
                                      console.log(
                                        "Failed to fetch order PDF",
                                        e
                                      );
                                    } finally {
                                      setDownloadingOrder(null);
                                    }
                                  }}
                                >
                                  <FontAwesome
                                    name='download'
                                    size={24}
                                    color='#1E3A8A'
                                  />
                                </Text>
                              )}
                            </View>
                          )}
                        </View>
                      )
                    )}
                  </Card>
                )}

                {/* Subject / Category */}
                {!!data.detail.category_details && (
                  <Card style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.title}>Subject</Text>
                    </View>
                    {renderRow(
                      "Category",
                      data.detail.category_details?.category
                    )}
                    {renderRow(
                      "Sub-Category",
                      data.detail.category_details?.sub_category
                    )}
                  </Card>
                )}

                {/* Acts */}
                {!!data.detail.acts && (
                  <Card style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.title}>Acts</Text>
                    </View>
                    {Object.values<any>(data.detail.acts).map(
                      (a: any, idx: number) => (
                        <View key={idx}>
                          {renderRow(
                            "Act",
                            `${a?.actname || "-"}${
                              a?.section ? ` (Section ${a.section})` : ""
                            }`
                          )}
                        </View>
                      )
                    )}
                  </Card>
                )}

                {/* Hearing History */}
                {!!data.detail.historyofcasehearing && (
                  <Card style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.title}>Hearing History</Text>
                    </View>
                    {Object.values<any>(data.detail.historyofcasehearing).map(
                      (h: any, idx: number, arr: any[]) => (
                        <View
                          key={idx}
                          style={[
                            styles.historyItem,
                            idx !== arr.length - 1 && styles.historyItemDivider,
                          ]}
                        >
                          {renderRow("Date", h?.hearing_date)}
                          {renderRow(
                            "Purpose",
                            h?.purpose_of_listing
                              ? he.decode(String(h.purpose_of_listing))
                              : "-"
                          )}
                          {renderRow(
                            "Judge",
                            h?.judge_name
                              ? he.decode(String(h.judge_name))
                              : "-"
                          )}
                        </View>
                      )
                    )}
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
  // Main Content with Curved Design
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
  item: { fontSize: 12, color: "#111827", marginBottom: 4 },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
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
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },
  pillPending: {
    backgroundColor: "#FEF3C7",
  },
  pillDisposed: {
    backgroundColor: "#DCFCE7",
  },
  pillText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#111827",
  },
  orderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  downloadLink: { color: "#1E3A8A", fontWeight: "700", fontSize: 12 },
  error: { color: "#B00020" },
  jsonText: {
    fontFamily: Platform.select({ ios: "Courier", android: "monospace" }),
    fontSize: 12,
    color: "#111827",
  },
  historyItem: {
    paddingVertical: 6,
  },
  historyItemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 6,
  },
});

export default HighCourtResultScreen;
