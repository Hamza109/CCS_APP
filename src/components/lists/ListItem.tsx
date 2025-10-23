import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface ListItemProps {
  title: string;
  subtitle?: string;
  description?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  onRightIconPress?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  showChevron?: boolean;
  disabled?: boolean;
  badge?: string | number;
  badgeColor?: string;
}

const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  description,
  leftIcon,
  rightIcon,
  onPress,
  onRightIconPress,
  style,
  titleStyle,
  subtitleStyle,
  descriptionStyle,
  showChevron = false,
  disabled = false,
  badge,
  badgeColor = "#007AFF",
}) => {
  const containerStyle = [styles.container, disabled && styles.disabled, style];

  return (
    <Pressable
      style={({ pressed }) => [
        containerStyle,
        pressed && !disabled && { opacity: 0.7 },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.content}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Ionicons
              name={leftIcon}
              size={24}
              color={disabled ? "#6C757D" : "#007AFF"}
            />
          </View>
        )}

        <View style={styles.textContainer}>
          <View style={styles.titleContainer}>
            <Text
              style={[
                styles.title,
                disabled && styles.disabledText,
                titleStyle,
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
            {badge && (
              <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            )}
          </View>

          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                disabled && styles.disabledText,
                subtitleStyle,
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}

          {description && (
            <Text
              style={[
                styles.description,
                disabled && styles.disabledText,
                descriptionStyle,
              ]}
              numberOfLines={2}
            >
              {description}
            </Text>
          )}
        </View>

        <View style={styles.rightContainer}>
          {rightIcon && (
            <Pressable
              style={({ pressed }) => [
                styles.rightIconContainer,
                pressed && !disabled && { opacity: 0.7 },
              ]}
              onPress={onRightIconPress}
              disabled={disabled}
            >
              <Ionicons
                name={rightIcon}
                size={20}
                color={disabled ? "#6C757D" : "#6C757D"}
              />
            </Pressable>
          )}

          {showChevron && (
            <Ionicons
              name='chevron-forward'
              size={16}
              color={disabled ? "#6C757D" : "#6C757D"}
              style={styles.chevron}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  disabled: {
    opacity: 0.5,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
  },

  leftIconContainer: {
    marginRight: 12,
    width: 24,
    alignItems: "center",
  },

  textContainer: {
    flex: 1,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    flex: 1,
  },

  subtitle: {
    fontSize: 14,
    color: "#6C757D",
    marginBottom: 2,
  },

  description: {
    fontSize: 12,
    color: "#8E8E93",
    lineHeight: 16,
  },

  disabledText: {
    color: "#6C757D",
  },

  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  rightIconContainer: {
    padding: 4,
    marginRight: 8,
  },

  chevron: {
    marginLeft: 4,
  },

  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default ListItem;
