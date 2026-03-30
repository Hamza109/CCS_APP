import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { ReactNode } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

interface BlueHeaderProps {
  title: string;
  subtitle?: string;
  rightIconName?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  showRightBadge?: boolean;
  showBackButton?: boolean;
  onBackPress?: () => void;
  children?: ReactNode;
}

const BlueHeader: React.FC<BlueHeaderProps> = ({
  title,
  subtitle,
  rightIconName = "notifications",
  onRightPress,
  showRightBadge = true,
  showBackButton = Platform.OS === "ios",
  onBackPress,
  children,
}) => {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={styles.blueHeader}>
      <View style={styles.headerContent}>
        <View style={styles.leftContent}>
          {Platform.OS === "ios" && (
            <Pressable
              onPress={handleBackPress}
              hitSlop={8}
              style={({ pressed }) => [
                styles.backButton,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Ionicons name='chevron-back' size={24} color='#FFFFFF' />
            </Pressable>
          )}
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
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
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
  backButton: {
    paddingRight: 4,
    paddingVertical: 4,
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
