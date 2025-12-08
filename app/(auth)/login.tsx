import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../src/components/ui/Button";
import Input from "../../src/components/ui/Input";
import { useSendOtp } from "../../src/hooks/useOtp";

const LoginScreen: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const sendOtpMutation = useSendOtp();

  const handleContinue = async () => {
    const trimmed = phone.replace(/\s+/g, "");
    if (!/^\d{10}$/.test(trimmed)) {
      setError("Enter a valid 10-digit phone number");
      return;
    }
    setError(undefined);

    try {
      // Format phone number with country code and + prefix (91 for India)
      const mobileNumber = `91${trimmed}`;

      // Call API to send OTP using tanstack query mutation
      const response = await sendOtpMutation.mutateAsync({
        mobile_number: mobileNumber,
      });

      // Get OTP from API response
      console.log(response);

      // Save OTP locally for verification

      // Navigate to OTP screen
      router.push({ pathname: "/otp", params: { phone: trimmed } } as any);
    } catch (err: any) {
      console.error("Failed to send OTP:", err);
      setError("Failed to send OTP. Please try again.");
    }
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

          <Button
            title={sendOtpMutation.isPending ? "Sending..." : "Continue"}
            onPress={handleContinue}
            fullWidth
            disabled={sendOtpMutation.isPending}
          />
          {sendOtpMutation.isPending && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size='small' color='#1E3A8A' />
            </View>
          )}
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
  loaderContainer: {
    marginTop: 12,
    alignItems: "center",
  },
});

export default LoginScreen;
