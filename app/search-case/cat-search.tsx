import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import Button from "../../src/components/ui/Button";
import Input from "../../src/components/ui/Input";
import CustomPicker from "../../src/components/ui/Picker";
import { ROUTES } from "../../src/constants/routes";
import { useAppSelector } from "../../src/store";

const CatSearchScreen: React.FC = () => {
  const theme = useAppSelector((s) => s.app.theme);
  const [location, setLocation] = useState("");
  const [caseType, setCaseType] = useState("");
  const [caseNo, setCaseNo] = useState("");
  const [caseYear, setCaseYear] = useState("");

  const containerStyle = [
    styles.container,
    theme === "dark" && styles.darkContainer,
  ];

  const wings = [
    { id: "117", name: "Jammu" },
    { id: "119", name: "Srinagar" },
  ];

  const caseTypes = [
    { id: "1", name: "Original Application" },
    { id: "2", name: "Transfer Application" },
    { id: "3", name: "Misc Application" },
    { id: "4", name: "Contempt Petition" },
    { id: "5", name: "Petition for Transfer" },
    { id: "6", name: "Review Application" },
    { id: "7", name: "Criminal Contempt Petition" },
    { id: "8", name: "Oa Obj" },
  ];

  const handleSearch = () => {
    if (!location || !caseType || !caseNo || !caseYear) {
      alert("Please fill all fields");
      return;
    }

    const form = {
      location,
      caseType,
      caseNo,
      caseYear,
    };

    router.push({
      pathname: ROUTES.SEARCH_CASE.CAT_RESULT,
      params: form,
    } as any);
  };

  return (
    <SafeAreaView style={containerStyle} edges={["top"]}>
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title='CAT Cases Search' />
      <View style={styles.scrollView}>
        <View style={styles.mainContent}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>Search CAT Cases</Text>

            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Wing</Text>
                <CustomPicker
                  label=''
                  selectedValue={location}
                  onValueChange={setLocation}
                  options={wings}
                  placeholder='Select Wing'
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Case Type</Text>
                <CustomPicker
                  label=''
                  selectedValue={caseType}
                  onValueChange={setCaseType}
                  options={caseTypes}
                  placeholder='Select Case Type'
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Case Number</Text>
                <Input
                  placeholder='Enter Case Number'
                  value={caseNo}
                  onChangeText={setCaseNo}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Case Year</Text>
                <Input
                  placeholder='Enter Case Year'
                  value={caseYear}
                  onChangeText={setCaseYear}
                  keyboardType='numeric'
                  style={styles.input}
                />
              </View>
            </View>

            <Button
              title='Search Case'
              onPress={handleSearch}
              style={styles.searchButton}
              disabled={!location || !caseType || !caseNo || !caseYear}
            />
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
  title: { fontSize: 14, fontWeight: "700", marginBottom: 16 },
  formRow: {
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    marginBottom: 0,
  },
  searchButton: {
    marginTop: 8,
  },
});

export default CatSearchScreen;
