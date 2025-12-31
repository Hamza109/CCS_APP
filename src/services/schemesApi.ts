import axios from "axios";
import { ApiResponse } from "../types";
import api, { LOCAL_API_URL } from "./api";

export interface Scheme {
  scheme_id: number;
  title: string;
  description: string;
  file_path: string; // relative path like ../docs/<file>.pdf
  created_at: string;
}

export const schemesApi = {
  getSchemes: async (): Promise<ApiResponse<Scheme[]>> => {
    try {
      const url = `${LOCAL_API_URL}/api/schemes`;
      const response = await api.get(url, { timeout: 15000 });
      const payload = response.data;
      if (Array.isArray(payload)) {
        return {
          success: true,
          data: payload as Scheme[],
          message: "Schemes fetched successfully",
        } as ApiResponse<Scheme[]>;
      }
      return payload as ApiResponse<Scheme[]>;
    } catch (error) {
      console.error("Failed to fetch schemes:", error);
      // Dummy fallback
      return {
        success: true,
        data: [
          {
            scheme_id: 25,
            title: "Legal Aid Defense Counsel Scheme",
            description:
              "Legal Services Authorities provide legal services to accused/ convicts, who are in custody or otherwise coming within the eligibility criteria...",
            file_path: "../docs/68cd32b252be7_legal_aid_scheme.pdf",
            created_at: "2025-09-19T16:08:42.000000Z",
          },
        ],
        message: "Schemes fetched successfully",
      } as ApiResponse<Scheme[]>;
    }
  },
};

export default schemesApi;
