import axios from "axios";
import { ApiResponse } from "../types";
import api from "./api";

export interface LawDeptContactPayload {
  name: string;
  email: string;
  mobile_no: string;
  present_state: string;
  present_district: string;
  description: string;
  category: string;
  status: string;
  comment: string | null;
}

export interface LawDeptContactResponse extends LawDeptContactPayload {
  reg_no: string;
  created_at: string;
  id: number;
}

export const lawDeptContactApi = {
  submitContact: async (
    payload: LawDeptContactPayload
  ): Promise<ApiResponse<LawDeptContactResponse>> => {
    try {
      const response = await api.post("/api/contacts", payload, {
        timeout: 20000,
      });
      const data = response.data;
      // Normalize single-object responses
      if (!("success" in data)) {
        return { success: true, data } as ApiResponse<LawDeptContactResponse>;
      }
      return data as ApiResponse<LawDeptContactResponse>;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Surface 4xx/5xx validation/messages to UI
        throw error;
      }
      // Dummy fallback for local testing
      const now = new Date();
      return {
        success: true,
        data: {
          ...payload,
          reg_no: "ENS2025100709272511",
          created_at: now.toISOString(),
          id: Math.floor(Math.random() * 10000),
        },
        message: "Submitted (dummy)",
      } as ApiResponse<LawDeptContactResponse>;
    }
  },
};

export default lawDeptContactApi;
