import { useMutation } from "@tanstack/react-query";
import {
  otpApi,
  type OtpSendPayload,
  type OtpSendResponse,
  type OtpVerifyPayload,
  type OtpVerifyResponse,
} from "../services/otpApi";

export function useSendOtp() {
  return useMutation<OtpSendResponse, Error, OtpSendPayload>({
    mutationFn: (payload: OtpSendPayload) => otpApi.send(payload),
  });
}

export function useVerifyOtp() {
  return useMutation<OtpVerifyResponse, Error, OtpVerifyPayload>({
    mutationFn: (payload: OtpVerifyPayload) => otpApi.verify(payload),
  });
}
