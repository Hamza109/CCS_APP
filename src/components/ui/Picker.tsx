import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useMemo, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export interface PickerOption {
  id: string;
  name: string;
}

interface CustomPickerProps {
  label: string;
  selectedValue: string;
  options: PickerOption[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  style?: any;
}

const CustomPicker: React.FC<CustomPickerProps> = ({
  label,
  selectedValue,
  options,
  onValueChange,
  placeholder = "Select an option",
  style,
}) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [tempSelectedValue, setTempSelectedValue] = useState(selectedValue);

  const snapPoints = useMemo(() => ["35%", "100%"], []);

  const selectedOption = options.find((option) => option.id === selectedValue);

  const showBottomSheet = () => {
    if (Platform.OS === "ios") {
      setTempSelectedValue(selectedValue);
      bottomSheetModalRef.current?.present();
    }
  };

  const handleSelect = () => {
    onValueChange(tempSelectedValue);
    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>

      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        itemTextStyle={styles.itemTextStyle}
        containerStyle={styles.dropdownContainer}
        data={
          options.length > 0
            ? options.map((option) => ({
                label: option.name,
                value: option.id,
              }))
            : []
        }
        search
        maxHeight={500}
        labelField='label'
        valueField='value'
        placeholder={placeholder}
        searchPlaceholder='Search...'
        value={selectedValue && selectedValue !== "" ? selectedValue : null}
        onChange={(item) => {
          if (item && item.value) {
            onValueChange(item.value);
          }
        }}
        renderLeftIcon={() => null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerButtonText: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  pickerButtonArrow: {
    fontSize: 12,
    color: "#6B7280",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  picker: {},
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
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
  itemTextStyle: {
    fontSize: 16,
    color: "#111827",
  },
  dropdownContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  bottomSheetBackground: {
    backgroundColor: "#FFFFFF",
  },
  handleIndicator: {
    backgroundColor: "#D1D5DB",
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  selectButton: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  selectButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default CustomPicker;
