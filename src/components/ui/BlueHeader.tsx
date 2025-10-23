import { Ionicons } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface BlueHeaderProps {
  title: string;
  subtitle?: string;
  rightIconName?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  showRightBadge?: boolean;
  children?: ReactNode;
}

const BlueHeader: React.FC<BlueHeaderProps> = ({
  title,
  subtitle,
  rightIconName = "notifications",
  onRightPress,
  showRightBadge = true,
  children,
}) => {
  return (
    <View style={styles.blueHeader}>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>{title}</Text>
        {onRightPress ? (
          <Pressable
            onPress={onRightPress}
            style={({ pressed }) => [
              styles.notificationButton,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Ionicons name={rightIconName as any} size={24} color='#FFFFFF' />
            {showRightBadge && <View style={styles.notificationBadge} />}
          </Pressable>
        ) : (
          <View style={styles.notificationPlaceholder} />
        )}
      </View>
      {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  blueHeader: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#E0E7FF",
  },
  notificationButton: {
    position: "relative",
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
  },
  notificationPlaceholder: {
    width: 40,
    height: 40,
  },
});

export default BlueHeader;
