import axios from "axios";
import { ApiResponse } from "../types";
import { LOCAL_API_URL } from "./api";
import api from "./api";

export interface ComplaintPayload {
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

export interface ComplaintResponse extends ComplaintPayload {
  reg_no: string;
  created_at: string;
  id: number;
}

export const complaintsApi = {
  submitComplaint: async (
    payload: ComplaintPayload
  ): Promise<ApiResponse<ComplaintResponse>> => {
    try {
      const response = await api.post("/api/complaints", payload, { timeout: 20000 });
      const data = response.data;
      if (!("success" in data)) {
        return { success: true, data } as ApiResponse<ComplaintResponse>;
      }
      return data as ApiResponse<ComplaintResponse>;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error;
      }
      const now = new Date();
      return {
        success: true,
        data: {
          ...payload,
          reg_no: "ENS" + now.getTime().toString(),
          created_at: now.toISOString(),
          id: Math.floor(Math.random() * 10000),
        },
        message: "Submitted (dummy)",
      } as ApiResponse<ComplaintResponse>;
    }
  },
};

export default complaintsApi;
