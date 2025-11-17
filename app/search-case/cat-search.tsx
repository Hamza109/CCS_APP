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
import { useCatSuggestions } from "../../src/hooks/useCat";
import { useAppSelector } from "../../src/store";

const locations = [
  { id: "117", name: "Jammu" },
  { id: "119", name: "Srinagar" },
];

const caseTypes = [
  { id: "1", name: "Original Application (O.A.)" },
  { id: "2", name: "Review Application (R.A.)" },
  { id: "3", name: "Contempt Application (C.A.)" },
  { id: "4", name: "Miscellaneous Application (M.A.)" },
];

const searchByOptions = [
  { id: "applicant", name: "Petitioner Name" },
  { id: "applicantadvocate", name: "Petitioner Advocate" },
  { id: "respondent", name: "Respondent Name" },
  { id: "respondentadvocate", name: "Respondent Advocate" },
  { id: "sub_category", name: "Subject" },
];

const CatSearchScreen: React.FC = () => {
  const theme = useAppSelector((s) => s.app.theme);
  const [form, setForm] = useState({
    location: "",
    case_type: "",
    case_year: "",
    case_no: "",
  });
  const [searchBy, setSearchBy] = useState<string>("");
  const [searchByValue, setSearchByValue] = useState<string>(""); // selected option
  const [searchByQuery, setSearchByQuery] = useState<string>(""); // typed query

  const { options: suggestOptions, isLoading: suggestLoading } =
    useCatSuggestions((searchBy || undefined) as any, searchByQuery, {});

  const dropdownData = useMemo(() => {
    const base = suggestOptions.map((o) => ({ label: o.name, value: o.id }));
    if (searchByValue && !base.find((x) => x.value === searchByValue)) {
      base.unshift({ label: searchByValue, value: searchByValue });
    }
    return base;
  }, [suggestOptions, searchByValue]);

  const onSubmit = () => {
    const query: any = {};
    if (form.location) query.location = form.location;
    if (form.case_type) query.case_type = form.case_type;
    if (form.case_year) query.case_year = form.case_year;
    if (form.case_no) query.case_no = form.case_no;
    if (searchBy && searchByValue) {
      query[searchBy] = searchByValue;
    }
    query.per_page = 20;
    query.page = 1;

    router.push({
      pathname: ROUTES.SEARCH_CASE.CAT_LIST,
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
      <BlueHeader title='CAT Cases Search' />
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
              <Text style={styles.title}>Search CAT Cases</Text>

              <CustomPicker
                label='Location'
                selectedValue={form.location}
                options={locations}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, location: value }))
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
                  setSearchByQuery("");
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
                value={form.case_year}
                onChangeText={(t) => setForm((p) => ({ ...p, case_year: t }))}
                keyboardType='number-pad'
                placeholder='e.g. 2024'
              />

              <Text style={styles.label}>Case No</Text>
              <TextInput
                style={styles.input}
                value={form.case_no}
                onChangeText={(t) => setForm((p) => ({ ...p, case_no: t }))}
                keyboardType='number-pad'
                placeholder='e.g. 123'
              />

              <Button
                title='Search'
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
  scrollView: { flex: 1, backgroundColor: "#1E3A8A" },
  mainContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    flex: 1,
  },
  content: { padding: 16 },
  title: { fontSize: 14, fontWeight: "700", marginBottom: 16 },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  button: { marginTop: 4 },
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
  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
});

export default CatSearchScreen;
