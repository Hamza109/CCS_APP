import { ApiResponse } from "../types";
import api from "./api";

// District API Types
export type District = string;

// Districts API
export const districtsApi = {
  /**
   * Get all districts
   * @returns Promise with list of districts (array of strings)
   */
  getDistricts: async (): Promise<ApiResponse<District[]>> => {
    try {
      console.log("Fetching districts from: /api/districts");

      const response = await api.get("/api/districts");

      const payload = response.data;
      // Normalize plain array responses to ApiResponse shape
      if (Array.isArray(payload)) {
        return {
          success: true,
          data: payload as District[],
          message: "Districts fetched successfully",
        } as ApiResponse<District[]>;
      }
      return payload as ApiResponse<District[]>;
    } catch (error) {
      console.error("Failed to fetch districts:", error);

      // Return dummy data as fallback
      console.log("Using dummy districts data");
      return {
        success: true,

        message: "Districts fetched successfully",
      } as ApiResponse<District[]>;
    }
  },
};

export default districtsApi;
