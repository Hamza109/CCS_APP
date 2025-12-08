import api from "./api";

export type OtpSendPayload = {
  mobile_number: string;
};

export type OtpSendResponse = {
  status?: string;
  message?: string;
  mobile_number?: string;
  otp?: string; // OTP received from API response
};

export type OtpVerifyPayload = {
  mobile_number: string;
  otp: string;
};

export type OtpVerifyResponse = {
  status: string;
  message: string;
  access_token: string;
  token_type: string;
  expires_in: number;
};

export const otpApi = {
  async send(payload: OtpSendPayload): Promise<OtpSendResponse> {
    const res = await api.post("/api/otp/send", payload);
    return res.data;
  },
  async verify(payload: OtpVerifyPayload): Promise<OtpVerifyResponse> {
    const res = await api.post("/api/otp/verify", payload);
    return res.data;
  },
};

export default otpApi;
