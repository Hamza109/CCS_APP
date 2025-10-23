import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";
import Input from "../../src/components/ui/Input";
import { useHighCourtCnrDetails } from "../../src/hooks/useHighCourt";
import { useAppSelector } from "../../src/store";

const FcrCourtSearchScreen: React.FC = () => {
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

  return (
    <SafeAreaView style={containerStyle} edges={["top"]}>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='FCR Court Search' />
      <View style={styles.scrollView}>
        <View style={styles.mainContent}>
          <ScrollView contentContainerStyle={styles.content}>
            <Card style={styles.card}>
              <Text style={styles.title}>Search by CNR Number</Text>
              <Input
                placeholder='Enter Case Number'
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

            {isLoading && (
              <Card style={styles.card}>
                <Text>Searching...</Text>
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
                <Card style={styles.card}>
                  <Text style={styles.title}>Case Information</Text>
                  {renderRow("CNR Number", data.cino)}
                  {renderRow("Case Type", data.type_name_fil)}
                  {renderRow(
                    "Filing No/Year",
                    `${data.fil_no || "-"} / ${data.fil_year || "-"}`
                  )}
                  {renderRow(
                    "Reg No/Year",
                    `${data.reg_no || "-"} / ${data.reg_year || "-"}`
                  )}
                  {renderRow("Court", data.court_est_name)}
                  {renderRow(
                    "State / District",
                    `${data.state_name || "-"} / ${data.dist_name || "-"}`
                  )}
                  {renderRow("Filing Date", data.date_of_filing)}
                  {renderRow("Registration Date", data.dt_regis)}
                </Card>

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
                  {renderRow("Designation", (data as any).desgname)}
                </Card>

                <Card style={styles.card}>
                  <Text style={styles.title}>Parties & Advocates</Text>
                  {renderRow("Petitioner", data.pet_name)}
                  {renderRow("Petitioner Advocate", data.pet_adv)}
                  {renderRow("Respondent", data.res_name)}
                  {renderRow("Respondent Advocate", data.res_adv)}
                </Card>
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
  error: { color: "#B00020" },
});

export default FcrCourtSearchScreen;
