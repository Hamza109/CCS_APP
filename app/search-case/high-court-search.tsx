import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import CustomPicker from "../../src/components/ui/Picker";
import { ROUTES } from "../../src/constants/routes";
import { caseTypes } from "../../src/data/caseTypes";
import { useHighCourtSuggestions } from "../../src/hooks/useHighCourt";
import { useAppSelector } from "../../src/store";

const wings = [
  { id: "JKHC02", name: "Jammu Highcourt" },
  { id: "JKHC01", name: "Srinagar Highcourt" },
];

const searchByOptions = [
  { id: "pet_name", name: "Petitioner Name" },
  { id: "pet_adv", name: "Petitioner Advocate" },
  { id: "res_name", name: "Respondent Name" },
  { id: "res_advocate", name: "Respondent Advocate" },
  { id: "sub_category", name: "Subject" },
];

const HighCourtSearchScreen: React.FC = () => {
  const theme = useAppSelector((s) => s.app.theme);
  const [form, setForm] = useState({
    est_code: "",
    case_type: "",
    reg_year: "",
    reg_no: "",
  });
  const [searchBy, setSearchBy] = useState<string>("");
  const [searchByValue, setSearchByValue] = useState<string>(""); // selected option
  const [searchByQuery, setSearchByQuery] = useState<string>(""); // typed query
  const [submitted, setSubmitted] = useState(false);

  const { options: suggestOptions, isLoading: suggestLoading } =
    useHighCourtSuggestions((searchBy || undefined) as any, searchByQuery, {
      est_code: form.est_code || undefined,
      case_type: form.case_type || undefined,
      reg_year: form.reg_year || undefined,
      reg_no: form.reg_no || undefined,
    });

  const dropdownData = useMemo(() => {
    const base = suggestOptions.map((o) => ({ label: o.name, value: o.id }));
    if (searchByValue && !base.find((x) => x.value === searchByValue)) {
      base.unshift({ label: searchByValue, value: searchByValue });
    }
    return base;
  }, [suggestOptions, searchByValue]);

  const onSubmit = () => {
    const query: any = {};
    if (form.est_code) query.est_code = form.est_code;
    if (form.case_type) query.case_type = form.case_type;
    if (form.reg_year) query.reg_year = form.reg_year;
    if (form.reg_no) query.reg_no = form.reg_no;
    if (searchBy && searchByValue) {
      query[searchBy] = searchByValue;
    }
    query.per_page = 20;
    query.page = 1;

    router.push({
      pathname: ROUTES.SEARCH_CASE.HIGH_COURT_LIST,
      params: query,
    } as any);
  };

  const containerStyle = [
    styles.container,
    theme === "dark" && styles.darkContainer,
  ];

  return (
    <SafeAreaView style={containerStyle} edges={["top"]}>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='High Court Case Search' />
      <View style={styles.scrollView}>
        <View style={styles.mainContent}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.flex1}
          >
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps='handled'
            >
              <CustomPicker
                label='Wing'
                selectedValue={form.est_code}
                options={wings}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, est_code: value }))
                }
              />

              <CustomPicker
                label='Case Type'
                selectedValue={form.case_type}
                options={caseTypes}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, case_type: value }))
                }
              />

              <View style={styles.separator} />

              <CustomPicker
                label='Search By'
                selectedValue={searchBy}
                options={searchByOptions}
                onValueChange={(value) => {
                  setSearchBy(value);
                  setSearchByValue("");
                }}
                placeholder='Select field'
              />

              {!!searchBy && (
                <>
                  <Text style={styles.label}>
                    {searchByOptions.find((o) => o.id === searchBy)?.name ||
                      "Value"}
                  </Text>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={dropdownData}
                    search
                    maxHeight={400}
                    labelField='label'
                    valueField='value'
                    placeholder={
                      suggestLoading ? "Searching…" : "Type to search and pick"
                    }
                    searchPlaceholder='Type at least 1 character'
                    value={searchByValue || null}
                    onChange={(item) => {
                      setSearchByValue(item.value);
                      setSearchByQuery("");
                    }}
                    onChangeText={(t: string) => setSearchByQuery(t)}
                    renderLeftIcon={() => null}
                  />
                </>
              )}

              <Text style={styles.label}>Case Year</Text>
              <TextInput
                style={styles.input}
                value={form.reg_year}
                onChangeText={(t) => setForm((p) => ({ ...p, reg_year: t }))}
                keyboardType='number-pad'
                placeholder='e.g. 2024'
              />

              <Text style={styles.label}>Case No</Text>
              <TextInput
                style={styles.input}
                value={form.reg_no}
                onChangeText={(t) => setForm((p) => ({ ...p, reg_no: t }))}
                keyboardType='number-pad'
                placeholder='e.g. 123'
              />

              <Button
                title={"Search"}
                onPress={onSubmit}
                style={styles.button}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E3A8A" },
  darkContainer: { backgroundColor: "#000000" },
  flex1: { flex: 1 },
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
  label: { fontSize: 12, fontWeight: "600", color: "#111827", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
  button: { marginTop: 4 },
  error: { color: "#B00020" },
  sectionTitle: { fontSize: 14, fontWeight: "700", marginBottom: 8 },
  jsonText: {
    fontFamily: Platform.select({ ios: "Courier", android: "monospace" }),
    fontSize: 12,
    color: "#111827",
  },
  separator: { height: 12 },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#111827",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    paddingHorizontal: 12,
  },
});

export default HighCourtSearchScreen;
