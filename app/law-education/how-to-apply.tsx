import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BlueHeader from "../../src/components/ui/BlueHeader";
import { useAppSelector } from "../../src/store";

const HowToApplyScreen: React.FC = () => {
  const theme = useAppSelector((state) => state.app.theme);

  return (
    <SafeAreaView
      style={[styles.container, theme === "dark" && styles.darkContainer]}
      edges={["top"]}
    >
      <StatusBar style='light' backgroundColor='#1E3A8A' />

      <BlueHeader
        title='How to apply and when to apply'
        subtitle='Application process, documents, and deadlines'
      />

      <View style={styles.content}>
        <Text
          style={[styles.placeholderText, theme === "dark" && styles.darkText]}
        >
          How to Apply functionality will be implemented here
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E3A8A",
  },
  darkContainer: {
    backgroundColor: "#000000",
  },
  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  darkText: {
    color: "#8E8E93",
  },
});

export default HowToApplyScreen;
