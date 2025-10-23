import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";
import Input from "../../src/components/ui/Input";
import { useHighCourtCnrDetails } from "../../src/hooks/useHighCourt";
import { useAppSelector } from "../../src/store";

const DistrictCourtSearchScreen: React.FC = () => {
  const theme = useAppSelector((s) => s.app.theme);
  const [cnrNumber, setCnrNumber] = useState("");
  const [searchParams, setSearchParams] = useState<
    { cino: string } | undefined
  >(undefined);

  const { data, isLoading, error } = useHighCourtCnrDetails(searchParams);

  const containerStyle = [
    styles.container,
    theme === "dark" && styles.darkContainer,
  ];

  const handleSearch = () => {
    if (!cnrNumber.trim()) return;
    setSearchParams({ cino: cnrNumber.trim() });
  };

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
      <BlueHeader title='District Court Search' />
      <View style={styles.scrollView}>
        <View style={styles.mainContent}>
          <ScrollView contentContainerStyle={styles.content}>
            {/* Search Form */}
            <Card style={styles.card}>
              <Text style={styles.title}>Search by CNR Number</Text>
              <Input
                placeholder='Enter CNR Number'
                value={cnrNumber}
                onChangeText={setCnrNumber}
                style={styles.input}
              />
              <Button
                title='Search'
                onPress={handleSearch}
                style={styles.searchButton}
                disabled={!cnrNumber.trim() || isLoading}
              />
            </Card>

            {/* Loading State */}
            {isLoading && (
              <Card style={styles.card}>
                <Text>Searching...</Text>
              </Card>
            )}

            {/* Error State */}
            {error && (
              <Card style={styles.card}>
                <Text style={styles.error}>
                  Error: {(error as any)?.message || "Something went wrong"}
                </Text>
              </Card>
            )}

            {/* Results */}
            {data && (
              <>
                {/* Basic Case Info */}
                <Card style={styles.card}>
                  <Text style={styles.title}>Case Information</Text>
                  {renderCodeRow("CNR Number", data.cino)}
                  {renderRow("Case Type", data.type_name)}
                  {renderRow(
                    "Filing No/Year",
                    `${data.fil_no || "-"} / ${data.fil_year || "-"}`
                  )}
                  {renderRow(
                    "Reg No/Year",
                    `${data.reg_no || "-"} / ${data.reg_year || "-"}`
                  )}
                  {renderRow("Court", data.court_est_name)}
                  {renderRow("Establishment", data.establishment_name)}
                  {renderRow("Court No", data.court_no)}
                  {renderRow(
                    "State / District",
                    `${data.state_name || "-"} / ${data.dist_name || "-"}`
                  )}
                  {renderRow("Filing Date", data.date_of_filing)}
                  {renderRow("Registration Date", data.dt_regis)}
                </Card>

                {/* Case Status */}
                <Card style={styles.card}>
                  <Text style={styles.title}>Case Status</Text>
                  {renderRow("First Hearing", data.date_first_list)}
                  {renderRow("Last Hearing", data.date_last_list)}
                  {renderRow("Next Hearing", data.date_next_list)}
                  {renderRow(
                    "Pending/Disposed",
                    data.pend_disp === "P"
                      ? "Pending"
                      : data.pend_disp === "D"
                      ? "Disposed"
                      : data.pend_disp || "-"
                  )}
                  {renderRow("Purpose", data.purpose_name)}
                  {renderRow("Designation", data.desgname)}
                </Card>

                {/* Parties & Advocates */}
                <Card style={styles.card}>
                  <Text style={styles.title}>Parties & Advocates</Text>
                  {renderRow("Petitioner", data.pet_name)}
                  {renderRow("Petitioner Advocate", data.pet_adv)}
                  {renderRow("Respondent", data.res_name)}
                  {renderRow("Respondent Advocate", data.res_adv)}
                  {data.res_extra_party && (
                    <View>
                      <Text style={styles.label}>Additional Respondents:</Text>
                      {Object.values<any>(data.res_extra_party).map(
                        (party: any, idx: number) => (
                          <Text key={idx} style={styles.value}>
                            • {party}
                          </Text>
                        )
                      )}
                    </View>
                  )}
                </Card>

                {/* FIR Information */}
                {data.fir_no && (
                  <Card style={styles.card}>
                    <Text style={styles.title}>FIR Information</Text>
                    {renderRow("FIR No", data.fir_no)}
                    {renderRow("FIR Year", data.fir_year)}
                    {renderRow("Police Station", data.police_station)}
                  </Card>
                )}

                {/* Acts */}
                {data.acts && (
                  <Card style={styles.card}>
                    <Text style={styles.title}>Acts</Text>
                    {Object.values<any>(data.acts).map(
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

                {/* Processes */}
                {data.processes && (
                  <Card style={styles.card}>
                    <Text style={styles.title}>Processes</Text>
                    {Object.values<any>(data.processes).map(
                      (p: any, idx: number) => (
                        <View key={idx} style={styles.processItem}>
                          {renderRow("Process ID", p.process_id)}
                          {renderRow("Title", p.process_title)}
                          {renderRow("Date", p.process_date)}
                        </View>
                      )
                    )}
                  </Card>
                )}

                {/* Hearing History */}
                {data.historyofcasehearing && (
                  <Card style={styles.card}>
                    <Text style={styles.title}>Hearing History</Text>
                    {Object.values<any>(data.historyofcasehearing).map(
                      (h: any, idx: number, arr: any[]) => (
                        <View
                          key={idx}
                          style={[
                            styles.historyItem,
                            idx !== arr.length - 1 && styles.historyItemDivider,
                          ]}
                        >
                          {renderRow("Date", h?.hearing_date)}
                          {renderRow("Purpose", h?.purpose_of_listing)}
                          {renderRow("Designation", h?.desgname)}
                          {renderRow("Business Date", h?.business_date)}
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
  input: { marginBottom: 16 },
  searchButton: { marginTop: 8 },
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
  historyItem: {
    paddingVertical: 6,
  },
  historyItemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 6,
  },
  processItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    marginBottom: 8,
  },
});

export default DistrictCourtSearchScreen;
