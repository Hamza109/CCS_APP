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

export const otpApi = {
  async send(payload: OtpSendPayload): Promise<OtpSendResponse> {
    const res = await api.post("/api/otp/send", payload);
    return res.data;
  },
};

export default otpApi;

