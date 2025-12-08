import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../src/components/ui/Button";
import Input from "../../src/components/ui/Input";
import { useSendOtp, useVerifyOtp } from "../../src/hooks/useOtp";
import { useAppDispatch } from "../../src/store";
import { setToken } from "../../src/store/slices/authSlice";

const RESEND_SECONDS = 30;

const OTPScreen: React.FC = () => {
  const { phone } = useLocalSearchParams<{ phone?: string }>();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dispatch = useAppDispatch();
  const verifyOtpMutation = useVerifyOtp();
  const sendOtpMutation = useSendOtp();

  useEffect(() => {
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const maskedPhone = useMemo(() => {
    if (!phone) return "";
    const p = String(phone);
    return p.replace(/\d(?=\d{2})/g, "*");
  }, [phone]);

  const handleVerify = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit OTP sent to your phone");
      return;
    }

    if (!phone) {
      setError("Phone number not found");
      return;
    }

    setError(undefined);

    try {
      // Format phone number with country code (91 for India)
      const mobileNumber = `91${phone}`;

      // Call API to verify OTP using tanstack query mutation
      const response = await verifyOtpMutation.mutateAsync({
        mobile_number: mobileNumber,
        otp: otp,
      });

      console.log("OTP verification response:", response.access_token);

      // Get token from API response
      const token = response.access_token;
      if (!token) {
        throw new Error("Token not received from server");
      }

      // Store token in Redux and SecureStore
      dispatch(setToken(token));
      await SecureStore.setItemAsync("auth_token", token);

      // Navigate to main app
      router.replace("/(tabs)");
    } catch (err: any) {
      console.error("OTP verification error:", err);
      setError(
        err?.response?.data?.message || "Invalid OTP. Please try again."
      );
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0) return;

    if (!phone) {
      setError("Phone number not found");
      return;
    }

    try {
      setError(undefined);
      const mobileNumber = `91${phone}`;

      // Call API to resend OTP using tanstack query mutation
      const response = await sendOtpMutation.mutateAsync({
        mobile_number: mobileNumber,
      });

      console.log("Resend OTP response:", response);

      // Reset timer
      setSecondsLeft(RESEND_SECONDS);
    } catch (err: any) {
      console.error("Failed to resend OTP:", err);
      setError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.blueHeader}>
        <Text style={styles.headerTitle}>Citizen-centric Services</Text>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify OTP</Text>
          {!!maskedPhone && (
            <Text style={styles.subtitle}>Sent to {maskedPhone}</Text>
          )}
        </View>

        <View style={styles.form}>
          <Input
            label='OTP'
            placeholder='Enter 6-digit code'
            value={otp}
            onChangeText={setOtp}
            keyboardType='numeric'
            autoCapitalize='none'
            maxLength={6}
            leftIcon='key'
            error={error}
            required
          />

          <Button
            title={verifyOtpMutation.isPending ? "Verifying..." : "Verify"}
            onPress={handleVerify}
            fullWidth
            disabled={verifyOtpMutation.isPending}
          />
          {verifyOtpMutation.isPending && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size='small' color='#1E3A8A' />
            </View>
          )}

          <View style={styles.resendRow}>
            <Text style={styles.infoText}>Didn't receive the code?</Text>
            <Button
              title={
                sendOtpMutation.isPending
                  ? "Sending..."
                  : secondsLeft > 0
                  ? `Resend in ${secondsLeft}s`
                  : "Resend"
              }
              onPress={handleResend}
              variant='ghost'
              size='small'
              disabled={secondsLeft > 0 || sendOtpMutation.isPending}
            />
          </View>
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
  resendRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoText: {
    fontSize: 14,
    color: "#6C757D",
  },
  loaderContainer: {
    marginTop: 12,
    alignItems: "center",
  },
});

export default OTPScreen;
