import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppSelector } from "../../src/store";

const CentreActsScreen: React.FC = () => {
  const theme = useAppSelector((s) => s.app.theme);
  return (
    <View style={[styles.container, theme === "dark" && styles.darkContainer]}>
      <Text style={[styles.title, theme === "dark" && styles.darkText]}>
        Centre - Acts, Rules & Notifications
      </Text>
      <Text style={[styles.subtitle, theme === "dark" && styles.darkSubtext]}>
        Coming soon
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA", padding: 20 },
  darkContainer: { backgroundColor: "#000000" },
  title: { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#6B7280" },
  darkText: { color: "#FFFFFF" },
  darkSubtext: { color: "#8E8E93" },
});

export default CentreActsScreen;
