import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import CustomPicker from "../../src/components/ui/Picker";
import { ROUTES } from "../../src/constants/routes";
import { caseTypes } from "../../src/data/caseTypes";
import { useAppSelector } from "../../src/store";

const wings = [
  { id: "JKHC02", name: "Jammu Highcourt" },
  { id: "JKHC01", name: "Srinagar Highcourt" },
];

const HighCourtSearchScreen: React.FC = () => {
  const theme = useAppSelector((s) => s.app.theme);
  const [form, setForm] = useState({
    est_code: "JKHC02",
    case_type: "72",
    reg_year: "2024",
    reg_no: "123",
  });
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = () => {
    router.push({
      pathname: ROUTES.SEARCH_CASE.HIGH_COURT_RESULT,
      params: form,
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
});

export default HighCourtSearchScreen;
