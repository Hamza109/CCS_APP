import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ActivityIndicator,
  Linking,
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
  useCatCaseDetails,
  useCatDailyOrders,
  useCatFinalOrders,
  useCatList,
} from "../../src/hooks/useCat";
import { useAppSelector } from "../../src/store";

const CatResultScreen: React.FC = () => {
  const theme = useAppSelector((s) => s.app.theme);
  const { catschemaId, casetypeId, caseNo, caseYear, id } = useLocalSearchParams<{
    catschemaId?: string;
    casetypeId?: string;
    caseNo?: string;
    caseYear?: string;
    id?: string;
  }>();

  // When id is provided, fetch from search API first
  const useId = !!id;
  const listForId = useId
    ? useCatList({ id: String(id), per_page: 1, page: 1 })
    : undefined;
  const listItem = listForId?.data?.data?.[0];

  // Extract params from list item or use direct params
  const params = useId && listItem
    ? {
        catschemaId: String(listItem.location),
        casetypeId: String(listItem.case_type),
        caseNo: String(listItem.case_no),
        caseYear: String(listItem.year),
      }
    : catschemaId && casetypeId && caseNo && caseYear
    ? {
        catschemaId: String(catschemaId),
        casetypeId: String(casetypeId),
        caseNo: String(caseNo),
        caseYear: String(caseYear),
      }
    : undefined;

  const { data, isLoading, error } = useCatCaseDetails(params);
  const caseData = useId && listItem ? listItem : data?.data; // Use list item if from list, else use case details
  const {
    data: dailyOrdersResp,
    isLoading: isLoadingDaily,
    error: errorDaily,
  } = useCatDailyOrders(params);
  const dailyOrders = dailyOrdersResp?.data;
  const {
    data: finalOrdersResp,
    isLoading: isLoadingFinal,
    error: errorFinal,
  } = useCatFinalOrders(params);
  const finalOrders = finalOrdersResp?.data;
  const allLoading = (useId ? !!listForId?.isLoading : isLoading) && isLoadingDaily && isLoadingFinal;
  const showSpinner = allLoading;
  // no download state needed when opening URL directly

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
            {showSpinner && (
              <View style={styles.spinnerWrap}>
                <ActivityIndicator size='large' color='#1E3A8A' />
                <Text style={styles.spinnerText}>Loading case details…</Text>
              </View>
            )}

            {((useId && listForId?.error) || error || errorDaily || errorFinal) && (
              <Card style={styles.card}>
                <Text style={styles.error}>
                  Error:{" "}
                  {((useId && (listForId?.error as any)?.message) ||
                    (error as any)?.message ||
                    (errorDaily as any)?.message ||
                    (errorFinal as any)?.message) ??
                    "Something went wrong"}
                </Text>
              </Card>
            )}

            {caseData && (
              <>
                {/* Case Details */}
                <Card style={styles.card}>
                  <Text style={styles.title}>Case Details</Text>
                  {renderRow("Case Number", caseData.caseno)}
                  {renderRow("Case Type", caseData.caseType || (caseData as any).caseType)}
                  {renderRow("Diary Number", (caseData as any).diaryno)}
                  {renderRow("Date of Filing", caseData.dateoffiling)}
                  {renderRow("Location", caseData.location || (caseData as any).location)}
                  {renderRow("Case Status", caseData.casestatus)}
                  {renderRow("Disposal Nature", caseData.disposalNature)}
                  {renderRow("Date of Disposal", caseData.dateofdisposal)}
                </Card>

                {/* Parties */}
                <Card style={styles.card}>
                  <Text style={styles.title}>Parties & Advocates</Text>
                  {renderRow("Petitioner", caseData.applicant)}
                  {renderRow("Petitioner Advocate", caseData.applicantadvocate)}
                  {renderRow(
                    "Applicant Advocate 1",
                    (caseData as any).applicantadvocate1
                  )}
                  {renderRow("Respondent", caseData.respondent)}
                  {renderRow(
                    "Respondent Advocate",
                    caseData.respondentadvocate
                  )}
                  {renderRow(
                    "Additional Party (Petitioner)",
                    caseData.additionalpartypet
                  )}
                  {renderRow(
                    "Additional Party (Respondent)",
                    caseData.additionalpartyres
                  )}
                </Card>

                {/* Listing Dates */}
                <Card style={styles.card}>
                  <Text style={styles.title}>Listing Information</Text>
                  {renderRow("Last Listing Date", caseData.lastlistingdate)}
                  {renderRow("Next Listing Date", (caseData as any).nextlistingdate)}
                  {renderRow("Next Listing Date 1", (caseData as any).nextlistingdate1)}
                  {renderRow("Next Listing Date 2", (caseData as any).nextlistingdate2)}
                  {renderRow(
                    "Next Listing Purpose",
                    caseData.nextListingPurpose
                  )}
                  {renderRow("Connected Diary Number", (caseData as any).conndiaryno)}
                  {renderRow("Court Number", caseData.courtNo)}
                  {renderRow("Court Name", caseData.courtName)}
                </Card>

                {/* Daily Orders */}
                {dailyOrders &&
                  Array.isArray(dailyOrders) &&
                  dailyOrders.length > 0 && (
                    <Card style={styles.card}>
                      <Text style={styles.title}>Daily Orders</Text>
                      {dailyOrders.map((order: any, idx: number) => (
                        <View key={idx} style={styles.orderItem}>
                          {renderRow("Date of Order", order.dateoforder)}
                          {renderRow("Applicant", order.applicantName)}
                          {renderRow("Respondent", order.respondentName)}
                          {renderRow("Item No", order.itemNo)}
                          {!!order.dailyOrderPdf && (
                            <View style={styles.downloadRow}>
                              <Text style={styles.value} numberOfLines={1}>
                                PDF
                              </Text>
                              <Text
                                style={styles.downloadLink}
                                onPress={() =>
                                  Linking.openURL(String(order.dailyOrderPdf))
                                }
                              >
                                <FontAwesome
                                  name='download'
                                  size={20}
                                  color='#1E3A8A'
                                />
                              </Text>
                            </View>
                          )}
                        </View>
                      ))}
                    </Card>
                  )}

                {/* Final Orders */}
                {finalOrders &&
                  Array.isArray(finalOrders) &&
                  finalOrders.length > 0 && (
                    <Card style={styles.card}>
                      <Text style={styles.title}>Final Orders</Text>
                      {finalOrders.map((order: any, idx: number) => (
                        <View key={idx} style={styles.orderItem}>
                          {renderRow("Date of Disposal", order.dateofdisposal)}
                          {renderRow("Applicant", order.applicantName)}
                          {renderRow("Respondent", order.respondentName)}
                          {renderRow("Diary No", order.diaryno)}
                          {!!order.dailyOrderPdf && (
                            <View style={styles.downloadRow}>
                              <Text style={styles.value} numberOfLines={1}>
                                PDF
                              </Text>
                              <Text
                                style={styles.downloadLink}
                                onPress={() =>
                                  Linking.openURL(String(order.dailyOrderPdf))
                                }
                              >
                                <FontAwesome
                                  name='download'
                                  size={20}
                                  color='#1E3A8A'
                                />
                              </Text>
                            </View>
                          )}
                        </View>
                      ))}
                    </Card>
                  )}
              </>
            )}

            {/* Fallback: show raw response if shape is unexpected and not loading */}
            {!showSpinner && !caseData && data && (
              <Card style={styles.card}>
                <Text style={styles.title}>Raw Response</Text>
                <Text style={styles.jsonText}>
                  {JSON.stringify(data, null, 2)}
                </Text>
              </Card>
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
  spinnerWrap: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  spinnerText: { fontSize: 12, color: "#6B7280" },
  spinnerInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
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
  downloadRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 4,
  },
  downloadLink: { color: "#1E3A8A", fontWeight: "700", fontSize: 12 },
});

export default CatResultScreen;
