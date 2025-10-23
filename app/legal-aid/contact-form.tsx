import { StatusBar } from "expo-status-bar";
import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import BlueHeader from "../../src/components/ui/BlueHeader";
import UnifiedContactForm from "../../src/components/forms/UnifiedContactForm";
import { useAppSelector } from "../../src/store";
import { useSubmitLawDeptContact } from "../../src/hooks/useLawDeptContact";
import { useSubmitComplaint } from "../../src/hooks/useComplaints";

const CATEGORY_OPTIONS = [
  { id: 1, title: "Acts, Rule and Notifications" },
  { id: 2, title: "Advocate Related Matters" },
  { id: 3, title: "Law Education" },
  { id: 4, title: "Legal Aid/Advice" },
  { id: 5, title: "Legislative Assembly" },
  { id: 6, title: "Registration of Documents" },
  { id: 7, title: "Registration of Marriage" },
  { id: 8, title: "Search your Case" },
  { id: 9, title: "Women & Child Development" },
  { id: 10, title: "Other" },
];

const ContactFormScreen: React.FC = () => {
  const theme = useAppSelector((state) => state.app.theme);
  const params = useLocalSearchParams<{ type?: string }>();
  const type = (params.type || "law").toString();

  const { mutateAsync: submitLaw, isPending: isSubmittingLaw } =
    useSubmitLawDeptContact();
  const { mutateAsync: submitComplaint, isPending: isSubmittingComplaint } =
    useSubmitComplaint();

  const headerTitle = type === "grievance" ? "Grievance & Feedback" : "Contact Law Department";
  const submitLabel = (type === "grievance" ? isSubmittingComplaint : isSubmittingLaw)
    ? "Submitting..."
    : "Submit";
  const successTitle =
    type === "grievance"
      ? "Grievance submitted successfully"
      : "Query submitted successfully";

  const onSubmit = useMemo(() => {
    return type === "grievance"
      ? (payload: any) => submitComplaint(payload as any)
      : (payload: any) => submitLaw(payload as any);
  }, [type, submitComplaint, submitLaw]);

  return (
    <SafeAreaView
      style={[styles.container, theme === "dark" && styles.darkContainer]}
      edges={["top"]}
    >
      <StatusBar style='light' backgroundColor='#1E3A8A' />
      <BlueHeader title={headerTitle} />
      <UnifiedContactForm
        categoryOptions={CATEGORY_OPTIONS}
        onSubmit={onSubmit}
        submitLabel={submitLabel}
        successAlertTitle={successTitle}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E3A8A" },
  darkContainer: { backgroundColor: "#000000" },
});

export default ContactFormScreen;


