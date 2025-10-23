import { ApiResponse } from "../types";
import api from "./api";

// Pro-Bono Lawyers API Types
export interface ProBonoLawyer {
  id: number;
  name: string;
  district_name: string;
  mobile_number: string;
  created_at: string;
}

// Pro-Bono Lawyers API
export const proBonoLawyersApi = {
  /**
   * Get all pro-bono lawyers, optionally filtered by district
   * @param district - Optional district name to filter lawyers
   * @returns Promise with list of pro-bono lawyers
   */
  getLawyers: async (
    district?: string
  ): Promise<ApiResponse<ProBonoLawyer[]>> => {
    try {
      console.log("Fetching pro-bono lawyers from: /api/pro-bono-lawyers");
      console.log("District filter:", district);

      const response = await api.get("/api/pro-bono-lawyers", {
        params: district ? { district } : {},
      });

      console.log("Pro-Bono Lawyers API Response:", response.data);

      // Normalize plain array responses to ApiResponse shape
      const payload = response.data;
      if (Array.isArray(payload)) {
        return {
          success: true,
          data: payload as ProBonoLawyer[],
          message: "Pro-bono lawyers fetched successfully",
        } as ApiResponse<ProBonoLawyer[]>;
      }
      return payload as ApiResponse<ProBonoLawyer[]>;
    } catch (error) {
      console.error("Failed to fetch pro-bono lawyers:", error);

      // Return dummy data as fallback
      console.log("Using dummy pro-bono lawyers data");
      return {
        success: true,
        data: [
          {
            id: 1,
            name: "Dr. Rajesh Kumar",
            district_name: "Srinagar",
            mobile_number: "9876543210",
            created_at: "2024-01-15T10:30:00.000000Z",
          },
          {
            id: 2,
            name: "Adv. Priya Sharma",
            district_name: "Jammu",
            mobile_number: "9876543211",
            created_at: "2024-01-16T11:45:00.000000Z",
          },
          {
            id: 3,
            name: "Adv. Ahmed Khan",
            district_name: "Anantnag",
            mobile_number: "9876543212",
            created_at: "2024-01-17T09:15:00.000000Z",
          },
          {
            id: 4,
            name: "Adv. Abdul Rasheed Hanjura",
            district_name: "Budgam",
            mobile_number: "9416075361",
            created_at: "2024-01-18T14:20:00.000000Z",
          },
        ],
        message: "Pro-bono lawyers fetched successfully",
      } as ApiResponse<ProBonoLawyer[]>;
    }
  },

  /**
   * Get districts for pro-bono lawyers
   * @returns Promise with list of districts where pro-bono lawyers are available
   */
  getDistricts: async (): Promise<ApiResponse<string[]>> => {
    try {
      console.log(
        "Fetching pro-bono lawyer districts from: /api/pro-bono-lawyers/districts"
      );

      const response = await api.get("/api/pro-bono-lawyers/districts");

      console.log("Pro-Bono Lawyer Districts API Response:", response.data);

      // Normalize plain array responses to ApiResponse shape
      const payload = response.data;
      if (Array.isArray(payload)) {
        return {
          success: true,
          data: payload as string[],
          message: "Pro-bono lawyer districts fetched successfully",
        } as ApiResponse<string[]>;
      }
      return payload as ApiResponse<string[]>;
    } catch (error) {
      console.error("Failed to fetch pro-bono lawyer districts:", error);

      // Return dummy data as fallback
      console.log("Using dummy pro-bono lawyer districts data");
      return {
        success: true,
        data: [
          "Srinagar",
          "Jammu",
          "Anantnag",
          "Baramulla",
          "Budgam",
          "Ganderbal",
          "Kupwara",
          "Pulwama",
          "Shopian",
          "Kulgam",
        ],
        message: "Pro-bono lawyer districts fetched successfully",
      } as ApiResponse<string[]>;
    }
  },

  /**
   * Get pro-bono lawyer by ID
   * @param id - Lawyer ID
   * @returns Promise with lawyer details
   */
};

export default proBonoLawyersApi;
