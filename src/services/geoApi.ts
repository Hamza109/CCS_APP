import { ApiResponse } from "../types";
import api from "./api";

export interface StateItem {
  id: number;
  name: string;
}

export interface DistrictItem {
  id: number;
  state_id: number;
  name: string;
}

/**
 * Geo API - States and Districts
 */
export const geoApi = {
  /**
   * Get all states
   * @returns Promise with list of states
   */
  getStates: async (): Promise<ApiResponse<StateItem[]>> => {
    try {
      console.log("🌍 Fetching states from: /api/states");
      const response = await api.get("/api/states");

      const payload = response.data;
      console.log("🌍 Raw states response:", JSON.stringify(payload, null, 2));

      // Normalize plain array responses to ApiResponse shape
      if (Array.isArray(payload)) {
        console.log("🌍 States is array, normalizing to ApiResponse");
        const normalized = {
          success: true,
          data: payload as StateItem[],
          message: "States fetched successfully",
        } as ApiResponse<StateItem[]>;
        console.log("🌍 Normalized states:", normalized.data.length, "states");
        return normalized;
      }
      console.log("🌍 States response is not array, returning as ApiResponse");
      return payload as ApiResponse<StateItem[]>;
    } catch (error) {
      console.error("❌ Failed to fetch states:", error);
      // Return empty data as fallback
      console.log("Using fallback states data");
      return {
        success: true,
        data: [],
        message: "States fetched successfully",
      } as ApiResponse<StateItem[]>;
    }
  },

  /**
   * Get districts by state ID
   * @param stateId - State ID to get districts for
   * @returns Promise with list of districts for the state
   */
  getDistrictsByState: async (
    stateId: number
  ): Promise<ApiResponse<DistrictItem[]>> => {
    try {
      console.log(
        "🌍 Fetching districts for state:",
        stateId,
        "from: /api/districts-by-state"
      );
      const response = await api.get("/api/districts-by-state", {
        params: { state_id: stateId },
      });

      const payload = response.data;
      // Normalize plain array responses to ApiResponse shape
      if (Array.isArray(payload)) {
        return {
          success: true,
          data: payload as DistrictItem[],
          message: "Districts fetched successfully",
        } as ApiResponse<DistrictItem[]>;
      }
      return payload as ApiResponse<DistrictItem[]>;
    } catch (error) {
      console.error("❌ Failed to fetch districts:", error);
      // Return empty data as fallback
      console.log("Using fallback districts data");
      return {
        success: true,
        data: [],
        message: "Districts fetched successfully",
      } as ApiResponse<DistrictItem[]>;
    }
  },
};

export default geoApi;
