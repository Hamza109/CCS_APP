import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDistrictsByState, useStates } from "../../hooks/useGeo";
import Button from "../ui/Button";
import CustomPicker from "../ui/Picker";

export type UnifiedContactPayload = {
  name: string;
  email: string;
  mobile_no: string;
  present_state: string;
  present_district: string;
  description: string;
  category: string;
  status: string;
  comment: string | null;
};

type CategoryOption = { id: number | string; title: string };

type Props = {
  categoryOptions: CategoryOption[];
  onSubmit: (payload: UnifiedContactPayload) => Promise<any>;
  submitLabel?: string;
  successAlertTitle?: string;
};

const UnifiedContactForm: React.FC<Props> = ({
  categoryOptions,
  onSubmit,
  submitLabel = "Submit",
  successAlertTitle = "Submitted successfully",
}) => {
  const [form, setForm] = useState<UnifiedContactPayload>({
    name: "",
    email: "",
    mobile_no: "",
    present_state: "",
    present_district: "",
    description: "",
    category: "",
    status: "pending",
    comment: null,
  });

  const { data: statesData, isLoading: isLoadingStates } = useStates();
  const [selectedStateId, setSelectedStateId] = useState<number | undefined>(
    undefined
  );
  const { data: districtsData, isLoading: isLoadingDistricts } =
    useDistrictsByState(selectedStateId);

  const handleChange = (key: keyof UnifiedContactPayload, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await onSubmit(form);
      const regNo = res?.data?.reg_no || res?.reg_no;
      Alert.alert(successAlertTitle, `Your case no. is ${regNo}`);
      setForm({
        name: "",
        email: "",
        mobile_no: "",
        present_state: "",
        present_district: "",
        description: "",
        category: "",
        status: "pending",
        comment: null,
      });
      setSelectedStateId(undefined);
    } catch (e) {
      Alert.alert("Submission failed", "Please try again later.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.formContent}>
      {(
        [
          ["name", "Name"],
          ["email", "Email"],
          ["mobile_no", "Mobile No"],
        ] as Array<[keyof UnifiedContactPayload, string]>
      ).map(([key, label]) => (
        <View key={key} style={styles.inputGroup}>
          <Text style={styles.inputLabel}>{label}</Text>
          <TextInput
            style={styles.input}
            value={(form[key] as any) ?? ""}
            onChangeText={(t) => handleChange(key, t)}
            keyboardType={
              key === "email"
                ? "email-address"
                : (key as string).includes("mobile")
                ? "phone-pad"
                : "default"
            }
            autoCapitalize='none'
          />
        </View>
      ))}

      <View style={styles.inputGroup}>
        <CustomPicker
          label='Category'
          selectedValue={form.category || ""}
          options={categoryOptions.map((c) => ({
            id: c.title,
            name: c.title,
          }))}
          onValueChange={(value) => handleChange("category", value)}
          placeholder='Select a category'
        />
      </View>

      <View style={styles.inputGroup}>
        <CustomPicker
          label='Present State'
          selectedValue={selectedStateId?.toString() || ""}
          options={(statesData || []).map((s) => ({
            id: s.id.toString(),
            name: s.name,
          }))}
          onValueChange={(value) => {
            const numeric = parseInt(value, 10);
            setSelectedStateId(numeric);
            const sel = (statesData || []).find((s) => s.id === numeric);
            setForm((prev) => ({
              ...prev,
              present_state: sel?.name || "",
              present_district: "",
            }));
          }}
          placeholder={isLoadingStates ? "Loading states..." : "Select a state"}
        />
      </View>

      <View style={styles.inputGroup}>
        <CustomPicker
          label='Present District'
          selectedValue={form.present_district || ""}
          options={(districtsData || []).map((d) => ({
            id: d.name,
            name: d.name,
          }))}
          onValueChange={(value) =>
            setForm((prev) => ({
              ...prev,
              present_district: value,
            }))
          }
          placeholder={
            isLoadingDistricts
              ? "Loading districts..."
              : selectedStateId
              ? "Select a district"
              : "Select state first"
          }
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={form.description}
          onChangeText={(t) => handleChange("description", t)}
          multiline
          numberOfLines={4}
        />
      </View>

      <Button
        title={submitLabel}
        onPress={handleSubmit}
        style={styles.submitButton}
        textStyle={styles.submitButtonText}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formContent: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  inputGroup: { marginBottom: 12 },
  inputLabel: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  textArea: { height: 120, textAlignVertical: "top" },
  submitButton: {
    backgroundColor: "#1E3A8A",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});

export default UnifiedContactForm;
