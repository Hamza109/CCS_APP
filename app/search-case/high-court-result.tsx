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
import {
  useHighCourtCaseDetails,
  useHighCourtList,
} from "../../src/hooks/useHighCourt";
import highCourtApi from "../../src/services/highCourtApi";
import { useAppSelector } from "../../src/store";

const HighCourtResultScreen: React.FC = () => {
  const theme = useAppSelector((s) => s.app.theme);
  const { est_code, case_type, reg_year, reg_no, cino } = useLocalSearchParams<{
    est_code?: string;
    case_type?: string;
    reg_year?: string;
    reg_no?: string;
    cino?: string;
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

  const useCino = !!cino;
  // When cino is provided, use the generic search API filtered by cino
  const listForCino = useCino
    ? useHighCourtList({ cino: String(cino), per_page: 1, page: 1 })
    : undefined;
  const { data, isLoading, error } = useCino
    ? {
        data: { search: null, detail: listForCino?.data?.data?.[0] } as any,
        isLoading: !!listForCino?.isLoading,
        error: listForCino?.error,
      }
    : useHighCourtCaseDetails(params);
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

  const firstCase = useCino
    ? undefined
    : (() => {
        const casenos = data?.search?.casenos;
        if (!casenos) return undefined;
        const values = Object.values(casenos as any);
        return values?.[0] as any;
      })();

  const renderRow = (label: string, value?: string | number | null) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={3}>
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

  const isPresent = (v: any) => {
    if (v === null || v === undefined) return false;
    const s = String(v).trim();
    return s.length > 0 && s !== "null" && s !== "undefined";
  };

  const renderIf = (label: string, value: any) =>
    isPresent(value) ? renderRow(label, value) : null;

  const parseJson = (maybeJson: any) => {
    if (!isPresent(maybeJson) || typeof maybeJson !== "string") return null;
    const s = maybeJson.trim();
    if (!(s.startsWith("{") && s.endsWith("}"))) return null;
    try {
      return JSON.parse(s);
    } catch {
      return null;
    }
  };

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
              <View style={styles.loaderWrap}>
                <ActivityIndicator size='large' color='#1E3A8A' />
                <Text style={styles.loaderText}>Fetching case details…</Text>
              </View>
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
                {/* Case Overview */}
                <Card style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.title}>Case Overview</Text>
                    {getStatusPill(data.detail.pend_disp)}
                  </View>
                  {isPresent(data.detail.cino) &&
                    renderCodeRow("CINO", data.detail.cino)}
                  {renderIf(
                    "Case Type",
                    data.detail.type_name_fil || data.detail.type_name_reg
                  )}
                  {isPresent(data.detail.fil_no) ||
                  isPresent(data.detail.fil_year)
                    ? renderRow(
                        "Filing No/Year",
                        `${data.detail.fil_no || "-"} / ${
                          data.detail.fil_year || "-"
                        }`
                      )
                    : null}
                  {isPresent(data.detail.reg_no) ||
                  isPresent(data.detail.reg_year)
                    ? renderRow(
                        "Reg No/Year",
                        `${data.detail.reg_no || "-"} / ${
                          data.detail.reg_year || "-"
                        }`
                      )
                    : null}
                  {renderIf("Filing Date", data.detail.date_of_filing)}
                  {renderIf("Registration Date", data.detail.dt_regis)}
                  {renderIf("Short Order", data.detail.short_order)}
                </Card>

                {/* Court & Bench */}
                {(isPresent(data.detail.court_est_name) ||
                  isPresent(data.detail.bench_name) ||
                  isPresent(data.detail.judicial_branch) ||
                  isPresent(data.detail.coram) ||
                  isPresent(data.detail.purpose_name)) && (
                  <Card style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.title}>Court & Bench</Text>
                    </View>
                    {renderIf("Court", data.detail.court_est_name)}
                    {renderIf("Bench", data.detail.bench_name)}
                    {renderIf("Branch", data.detail.judicial_branch)}
                    {isPresent(data.detail.coram)
                      ? renderRow("Coram", he.decode(String(data.detail.coram)))
                      : null}
                    {renderIf("Purpose", data.detail.purpose_name)}
                  </Card>
                )}

                {/* Parties & Advocates */}
                {(isPresent(data.detail.pet_name) ||
                  isPresent(data.detail.pet_adv) ||
                  isPresent(data.detail.res_name) ||
                  isPresent(data.detail.res_adv)) && (
                  <Card style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.title}>Parties & Advocates</Text>
                    </View>
                    {renderIf("Petitioner", data.detail.pet_name)}
                    {renderIf("Petitioner Advocate", data.detail.pet_adv)}
                    {renderIf("Respondent", data.detail.res_name)}
                    {renderIf("Respondent Advocate", data.detail.res_adv)}
                  </Card>
                )}

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

                {/* Acts (from stringified fields) */}
                {(() => {
                  const actsObj = parseJson(data.detail.act1_name);
                  const sectionObj = parseJson(data.detail.act1_section);
                  const actEntry =
                    actsObj && actsObj.act1 ? actsObj.act1 : null;
                  const sections = sectionObj
                    ? Object.values<any>(sectionObj).filter(Boolean)
                    : [];
                  if (!actEntry && sections.length === 0) return null;
                  return (
                    <Card style={styles.card}>
                      <View style={styles.cardHeader}>
                        <Text style={styles.title}>Acts</Text>
                      </View>
                      {actEntry &&
                        renderRow(
                          "Act",
                          `${actEntry.actname || "-"}${
                            actEntry.section
                              ? ` (Section ${actEntry.section})`
                              : ""
                          }`
                        )}
                      {sections.map((sec: any, idx: number) => {
                        const downloadKey = `act-section-${
                          sec?.order_no || idx
                        }_${sec?.order_date || ""}`;
                        const canDownload =
                          isPresent(data.detail.cino) &&
                          isPresent(sec?.order_no) &&
                          isPresent(sec?.order_date);
                        return (
                          <View key={downloadKey} style={styles.orderEntry}>
                            {isPresent(sec?.order_no) && (
                              <View style={styles.row}>
                                <Text style={styles.label}>Order No</Text>
                                <Text style={styles.value}>{sec.order_no}</Text>
                              </View>
                            )}
                            {isPresent(sec?.order_date) && (
                              <View style={styles.row}>
                                <Text style={styles.label}>Order Date</Text>
                                <Text style={styles.value}>
                                  {sec.order_date}
                                </Text>
                              </View>
                            )}
                            {isPresent(sec?.order_details) && (
                              <View style={styles.row}>
                                <Text style={styles.label}>Details</Text>
                                <Text style={styles.value} numberOfLines={2}>
                                  {sec.order_details}
                                </Text>
                              </View>
                            )}
                            {canDownload && (
                              <View style={styles.downloadWrapper}>
                                {downloadingOrder === downloadKey ? (
                                  <ActivityIndicator
                                    size='small'
                                    color='#1E3A8A'
                                  />
                                ) : (
                                  <Text
                                    style={styles.downloadLink}
                                    onPress={async () => {
                                      try {
                                        setDownloadingOrder(downloadKey);
                                        const { pdfBase64 } =
                                          await highCourtApi.getOrderDownloadUrl(
                                            String(data.detail.cino),
                                            String(sec.order_no),
                                            String(sec.order_date)
                                          );
                                        if (!pdfBase64) return;
                                        const fileUri = `${
                                          FileSystem.cacheDirectory
                                        }order_${String(sec.order_no)}.pdf`;
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
                                      size={20}
                                      color='#1E3A8A'
                                    />
                                  </Text>
                                )}
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </Card>
                  );
                })()}

                {/* Hearings (from stringified field) */}
                {(() => {
                  const hearingsObj = parseJson(
                    data.detail.hearing1_causelist_type
                  );
                  if (!hearingsObj) return null;
                  const entries = Object.values<any>(hearingsObj);
                  if (!entries || entries.length === 0) return null;
                  return (
                    <Card style={styles.card}>
                      <View style={styles.cardHeader}>
                        <Text style={styles.title}>Hearings</Text>
                      </View>
                      {entries.map((h: any, idx: number) => (
                        <View key={idx} style={styles.historyItem}>
                          {renderIf("Hearing Date", h?.hearing_date)}
                          {renderIf("Purpose", h?.purpose_of_listing)}
                          {isPresent(h?.judge_name)
                            ? renderRow(
                                "Judge",
                                he.decode(String(h.judge_name))
                              )
                            : null}
                          {renderIf("Causelist Type", h?.causelist_type)}
                        </View>
                      ))}
                    </Card>
                  );
                })()}

                {/* Subject / Category */}
                {!!data.detail.category_details && (
                  <Card style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.title}>Subject</Text>
                    </View>
                    {renderIf(
                      "Category",
                      data.detail.category_details?.category
                    )}
                    {renderIf(
                      "Sub-Category",
                      data.detail.category_details?.sub_category
                    )}
                  </Card>
                )}

                {/* Final Order */}
                {(isPresent(data.detail.finalorder_no) ||
                  isPresent(data.detail.finalorder_date) ||
                  isPresent(data.detail.finalorder_details)) && (
                  <Card style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.title}>Final Order</Text>
                    </View>
                    {renderIf("Order No", data.detail.finalorder_no)}
                    {renderIf("Order Date", data.detail.finalorder_date)}
                    {renderIf("Details", data.detail.finalorder_details)}
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
                          {renderIf("Date", h?.hearing_date)}
                          {isPresent(h?.purpose_of_listing)
                            ? renderRow(
                                "Purpose",
                                he.decode(String(h.purpose_of_listing))
                              )
                            : null}
                          {isPresent(h?.judge_name)
                            ? renderRow(
                                "Judge",
                                he.decode(String(h.judge_name))
                              )
                            : null}
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
  loaderWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
  loaderText: {
    fontSize: 12,
    color: "#6B7280",
  },
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
  downloadWrapper: {
    alignItems: "flex-end",
    marginTop: 4,
  },
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
  orderEntry: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
});

export default HighCourtResultScreen;
