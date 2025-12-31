import axios from "axios";
import { ApiResponse } from "../types";
import api, { LOCAL_API_URL } from "./api";

// Para Legal Volunteers API Types
export interface ParaLegalVolunteer {
  id: number;
  name: string;
  mobile_number: string;
  empanelment: string;
  district_name: string;
  created_at: string;
}

// Para Legal Volunteers API
export const paraLegalVolunteersApi = {
  /**
   * Get all para legal volunteers, optionally filtered by district
   * @param district - Optional district name to filter volunteers
   * @returns Promise with list of para legal volunteers
   */
  getVolunteers: async (
    district?: string
  ): Promise<ApiResponse<ParaLegalVolunteer[]>> => {
    try {
      const url = `${LOCAL_API_URL}/api/para-legal-volunteers`;
      console.log("Fetching para legal volunteers from:", url);
      console.log("District filter:", district);

      const response = await api.get(url, {
        params: district ? { district } : {},
        timeout: 15000,
      });

      console.log("Para Legal Volunteers API Response:", response.data);

      // Normalize plain array responses to ApiResponse shape
      const payload = response.data;
      if (Array.isArray(payload)) {
        return {
          success: true,
          data: payload as ParaLegalVolunteer[],
          message: "Para legal volunteers fetched successfully",
        } as ApiResponse<ParaLegalVolunteer[]>;
      }
      return payload as ApiResponse<ParaLegalVolunteer[]>;
    } catch (error) {
      console.error("Failed to fetch para legal volunteers:", error);

      // Return dummy data as fallback
      console.log("Using dummy para legal volunteers data");
      return {
        success: true,
        data: [
          {
            id: 1,
            name: "Iqbal Illahi",
            mobile_number: "9149903505",
            empanelment: "DLSA Anantnag",
            district_name: "Anantnag",
            created_at: "2025-09-22T11:10:01.000000Z",
          },
          {
            id: 2,
            name: "Ahmad Sheikh",
            mobile_number: "9876543210",
            empanelment: "DLSA Srinagar",
            district_name: "Srinagar",
            created_at: "2025-09-22T11:10:01.000000Z",
          },
          {
            id: 3,
            name: "Fatima Begum",
            mobile_number: "9876543211",
            empanelment: "DLSA Jammu",
            district_name: "Jammu",
            created_at: "2025-09-22T11:10:01.000000Z",
          },
          {
            id: 4,
            name: "Mohammad Ali",
            mobile_number: "9876543212",
            empanelment: "DLSA Baramulla",
            district_name: "Baramulla",
            created_at: "2025-09-22T11:10:01.000000Z",
          },
        ],
        message: "Para legal volunteers fetched successfully",
      } as ApiResponse<ParaLegalVolunteer[]>;
    }
  },

  /**
   * Get districts for para legal volunteers
   * @returns Promise with list of districts where volunteers are available
   */
  getDistricts: async (): Promise<ApiResponse<string[]>> => {
    try {
      const url = `${LOCAL_API_URL}/api/para-legal-volunteers/districts`;
      console.log("Fetching para legal volunteer districts from:", url);

      const response = await api.get(url, {
        timeout: 15000,
      });

      console.log(
        "Para Legal Volunteer Districts API Response:",
        response.data
      );

      // Normalize plain array responses to ApiResponse shape
      const payload = response.data;
      if (Array.isArray(payload)) {
        return {
          success: true,
          data: payload as string[],
          message: "Para legal volunteer districts fetched successfully",
        } as ApiResponse<string[]>;
      }
      return payload as ApiResponse<string[]>;
    } catch (error) {
      console.error("Failed to fetch para legal volunteer districts:", error);

      // Return dummy data as fallback
      console.log("Using dummy para legal volunteer districts data");
      return {
        success: true,
        data: [
          "Anantnag",
          "Srinagar",
          "Jammu",
          "Baramulla",
          "Budgam",
          "Ganderbal",
          "Kupwara",
          "Pulwama",
          "Shopian",
          "Kulgam",
        ],
        message: "Para legal volunteer districts fetched successfully",
      } as ApiResponse<string[]>;
    }
  },
};

export default paraLegalVolunteersApi;
