import { ApiResponse } from "../types";
import api from "./api";

export interface DlsaContact {
  dlsa_id: number;
  office: string; // e.g., "DLSA"
  name_dlsa: string; // district or DLSA name, e.g., "Anantnag"
  name: string; // contact person's name
  mobile_no: string;
  alternate_no?: string;
  lat?: string | null;
  lng?: string | null;
  designation?: string;
}

export const dlsaApi = {
  getContacts: async (
    district?: string
  ): Promise<ApiResponse<DlsaContact[]>> => {
    try {
      const response = await api.get("/api/dlsa", {
        params: district ? { district } : {},
      });

      const payload = response.data;
      if (Array.isArray(payload)) {
        return {
          success: true,
          data: payload as DlsaContact[],
          message: "DLSA contacts fetched successfully",
        } as ApiResponse<DlsaContact[]>;
      }
      return payload as ApiResponse<DlsaContact[]>;
    } catch (error) {
      console.error("Failed to fetch DLSA contacts:", error);
      // Dummy fallback
      return {
        success: true,
        data: [
          {
            dlsa_id: 4,
            office: "DLSA",
            name_dlsa: "Anantnag",
            name: "Ms. Fozia Paul",
            mobile_no: "9796139333",
            alternate_no: "01932227663",
            lat: "33.73324948836277",
            lng: "75.14819664597134",
            designation: "Secretary",
          },
          {
            dlsa_id: 2,
            office: "DLSA",
            name_dlsa: "Srinagar",
            name: "Secretary DLSA Srinagar",
            mobile_no: "9876500000",
            designation: "Secretary",
          },
        ],
        message: "DLSA contacts fetched successfully",
      } as ApiResponse<DlsaContact[]>;
    }
  },

  getDistricts: async (): Promise<ApiResponse<string[]>> => {
    try {
      const response = await api.get("/api/dlsa/districts");

      const payload = response.data;
      if (Array.isArray(payload)) {
        return {
          success: true,
          data: payload as string[],
          message: "DLSA districts fetched successfully",
        } as ApiResponse<string[]>;
      }
      return payload as ApiResponse<string[]>;
    } catch (error) {
      console.error("Failed to fetch DLSA districts:", error);
      // Dummy fallback
      return {
        success: true,
        data: ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Budgam"],
        message: "DLSA districts fetched successfully",
      } as ApiResponse<string[]>;
    }
  },
};

export default dlsaApi;
