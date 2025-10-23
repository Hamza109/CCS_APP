import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from "react-native";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  showFilter?: boolean;
  onFilterPress?: () => void;
  style?: ViewStyle;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  value,
  onChangeText,
  onSearch,
  onClear,
  showFilter = false,
  onFilterPress,
  style,
  autoFocus = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  const handleSearch = () => {
    if (onSearch && value.trim()) {
      onSearch(value.trim());
    }
  };

  const handleClear = () => {
    onChangeText("");
    if (onClear) {
      onClear();
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <View style={[styles.container, style]}>
      <Pressable
        style={[styles.searchContainer, isFocused && styles.focused]}
        onPress={() => {
          if (textInputRef.current) {
            textInputRef.current.focus();
          }
        }}
      >
        <Ionicons
          name='search'
          size={20}
          color={isFocused ? "#007AFF" : "#6C757D"}
          style={styles.searchIcon}
        />

        <TextInput
          ref={textInputRef}
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleSearch}
          returnKeyType='search'
          autoFocus={autoFocus}
          placeholderTextColor='#6C757D'
          selectTextOnFocus={true}
        />

        {value.length > 0 && (
          <Pressable onPress={handleClear} style={styles.clearButton}>
            <Ionicons name='close-circle' size={20} color='#6C757D' />
          </Pressable>
        )}

        {showFilter && (
          <Pressable onPress={onFilterPress} style={styles.filterButton}>
            <Ionicons name='options' size={20} color='#6C757D' />
          </Pressable>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingHorizontal: 12,
    minHeight: 44,
  },
  focused: {
    borderColor: "#007AFF",
    backgroundColor: "#FFFFFF",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
    paddingVertical: 12,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  filterButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default SearchBar;
