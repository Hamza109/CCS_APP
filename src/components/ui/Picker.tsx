import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Picker } from "@react-native-picker/picker";
import React, { useMemo, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

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
      {Platform.OS === "ios" ? (
        <>
          <Pressable style={styles.pickerButton} onPress={showBottomSheet}>
            <Text style={styles.pickerButtonText}>
              {selectedOption ? selectedOption.name : placeholder}
            </Text>
            <Text style={styles.pickerButtonArrow}>▼</Text>
          </Pressable>

          <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={snapPoints}
            index={0}
            enablePanDownToClose
            backgroundStyle={styles.bottomSheetBackground}
            handleIndicatorStyle={styles.handleIndicator}
            enableDynamicSizing={false}
            backdropComponent={(props) => (
              <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                opacity={0.5}
              />
            )}
          >
            <BottomSheetView style={styles.bottomSheetContent}>
              <View style={styles.bottomSheetHeader}>
                <Text style={styles.bottomSheetTitle}>{label}</Text>
                <Pressable style={styles.selectButton} onPress={handleSelect}>
                  <Text style={styles.selectButtonText}>Select</Text>
                </Pressable>
              </View>

              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={tempSelectedValue}
                  onValueChange={setTempSelectedValue}
                  style={styles.picker}
                >
                  {placeholder && (
                    <Picker.Item label={placeholder} value='' enabled={true} />
                  )}
                  {options.map((option) => (
                    <Picker.Item
                      key={option.id}
                      label={option.name}
                      value={option.id}
                    />
                  ))}
                </Picker>
              </View>
            </BottomSheetView>
          </BottomSheetModal>
        </>
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedValue}
            onValueChange={onValueChange}
            style={styles.picker}
          >
            {placeholder && (
              <Picker.Item label={placeholder} value='' enabled={true} />
            )}
            {options.map((option) => (
              <Picker.Item
                key={option.id}
                label={option.name}
                value={option.id}
              />
            ))}
          </Picker>
        </View>
      )}
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
