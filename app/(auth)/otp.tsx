import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../src/components/ui/Button";
import Input from "../../src/components/ui/Input";
import { otpApi } from "../../src/services/otpApi";
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
    setError(undefined);

    try {
      // Get stored OTP from local storage
      const storedOtp = await SecureStore.getItemAsync("pending_otp");
      const storedPhone = await SecureStore.getItemAsync("pending_phone");

      if (!storedOtp) {
        setError("OTP expired. Please request a new one.");
        return;
      }

      // Verify entered OTP against stored OTP
      if (otp !== storedOtp) {
        setError("Invalid OTP. Please try again.");
        return;
      }

      // OTP verified successfully - grant access
      const token = `token_${storedPhone}_${Date.now()}`;
      dispatch(setToken(token));
      await SecureStore.setItemAsync("auth_token", token);

      // Clean up stored OTP
      await SecureStore.deleteItemAsync("pending_otp");
      await SecureStore.deleteItemAsync("pending_phone");

      router.replace("/(tabs)");
    } catch (err: any) {
      console.error("OTP verification error:", err);
      setError("Verification failed. Please try again.");
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
      const response = await otpApi.send({
        mobile_number: mobileNumber,
      });

      const receivedOtp = response.otp;
      if (!receivedOtp) {
        throw new Error("OTP not received from server");
      }

      // Save new OTP locally
      await SecureStore.setItemAsync("pending_otp", receivedOtp);
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

          <Button title='Verify' onPress={handleVerify} fullWidth />

          <View style={styles.resendRow}>
            <Text style={styles.infoText}>Didn't receive the code?</Text>
            <Button
              title={secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "Resend"}
              onPress={handleResend}
              variant='ghost'
              size='small'
              disabled={secondsLeft > 0}
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
});

export default OTPScreen;
