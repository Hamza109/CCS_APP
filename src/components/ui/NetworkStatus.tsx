import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppSelector } from "../../store";
interface NetworkStatusProps {
  visible?: boolean;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ visible = true }) => {
  const isOnline = useAppSelector((state) => state.app.isOnline);
  const theme = useAppSelector((state) => state.app.theme);

  if (!visible || isOnline) {
    return null;
  }

  const containerStyle = [
    styles.container,
    theme === "dark" && styles.darkContainer,
  ];

  return (
    <View style={containerStyle}>
      <Ionicons name='cloud-offline' size={16} color='#FF6B6B' />
      <Text style={[styles.text, theme === "dark" && styles.darkText]}>
        You&apos;re offline. Some features may be limited.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF3F3",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#FF6B6B",
  },
  darkContainer: {
    backgroundColor: "#2C1B1B",
    borderBottomColor: "#FF6B6B",
  },
  text: {
    marginLeft: 8,
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "500",
  },
  darkText: {
    color: "#FF6B6B",
  },
});

export default NetworkStatus;
