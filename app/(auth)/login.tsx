import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../src/components/ui/Button";
import Input from "../../src/components/ui/Input";

const LoginScreen: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  const handleContinue = () => {
    const trimmed = phone.replace(/\s+/g, "");
    if (!/^\d{10}$/.test(trimmed)) {
      setError("Enter a valid 10-digit phone number");
      return;
    }
    setError(undefined);
    router.push({ pathname: "/otp", params: { phone: trimmed } } as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.blueHeader}>
        <Text style={styles.headerTitle}>Citizen-centric Services</Text>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Sign in with your phone number</Text>
        </View>

        <View style={styles.form}>
          <Input
            label='Phone Number'
            placeholder='e.g. 9876543210'
            value={phone}
            onChangeText={setPhone}
            keyboardType='phone-pad'
            autoCapitalize='none'
            maxLength={10}
            leftIcon='call'
            error={error}
            required
          />

          <Button title='Continue'   onPress={handleContinue} fullWidth />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E3A8A",
  },
  blueHeader: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6C757D",
  },
  form: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});

export default LoginScreen;
