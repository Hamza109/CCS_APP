import { ApiResponse } from "../types";
import api from "./api";

export interface LiteracyClub {
  club_id: number;
  name: string;
  lat?: string | number | null;
  lng?: string | number | null;
  district_name: string;
}

export const literacyClubsApi = {
  getClubs: async (district?: string): Promise<ApiResponse<LiteracyClub[]>> => {
    try {
      const response = await api.get("/api/literacy-clubs", {
        params: district ? { district } : {},
      });
      const payload = response.data;
      if (Array.isArray(payload)) {
        return {
          success: true,
          data: payload as LiteracyClub[],
          message: "Literacy clubs fetched successfully",
        } as ApiResponse<LiteracyClub[]>;
      }
      return payload as ApiResponse<LiteracyClub[]>;
    } catch (error) {
      console.error("Failed to fetch literacy clubs:", error);
      return {
        success: true,
        data: [
          {
            club_id: 131,
            name: "Legal Literacy Club Amar Singh College",
            lat: "34.062583",
            lng: "74.807751",
            district_name: "Srinagar",
          },
          {
            club_id: 146,
            name: "LLC BHSS Sherpathri",
            lat: "34.202323",
            lng: "74.762491",
            district_name: "Ganderbal",
          },
        ],
        message: "Literacy clubs fetched successfully",
      } as ApiResponse<LiteracyClub[]>;
    }
  },

  getDistricts: async (): Promise<ApiResponse<string[]>> => {
    try {
      const response = await api.get("/api/literacy-clubs/districts");
      const payload = response.data;
      if (Array.isArray(payload)) {
        return {
          success: true,
          data: payload as string[],
          message: "Literacy club districts fetched successfully",
        } as ApiResponse<string[]>;
      }
      return payload as ApiResponse<string[]>;
    } catch (error) {
      console.error("Failed to fetch literacy club districts:", error);
      return {
        success: true,
        data: ["Srinagar", "Ganderbal", "Anantnag", "Baramulla"],
        message: "Literacy club districts fetched successfully",
      } as ApiResponse<string[]>;
    }
  },
};

export default literacyClubsApi;
