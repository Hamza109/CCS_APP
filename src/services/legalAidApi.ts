import { Platform } from "react-native";
import { ApiResponse } from "../types";
import api from "./api";

// Legal Aid API Types
export interface LegalAidClinic {
  aid_id: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  district_name: string;
}

// Legal Aid Services
export const legalAidApi = {
  /**
   * Get all legal aid clinics, optionally filtered by district
   * @param district - Optional district name to filter clinics
   * @returns Promise with list of legal aid clinics
   */
  getClinics: async (
    district?: string
  ): Promise<ApiResponse<LegalAidClinic[]>> => {
    try {
      console.log("Fetching clinics from: /api/legal-aid-clinics");
      console.log("Platform:", Platform.OS);
      console.log("District:", district);

      const response = await api.get("/api/legal-aid-clinics", {
        params: district ? { district } : {},
      });


      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw new Error("Failed to fetch legal aid clinics");
    }
  },
};

export default legalAidApi;
