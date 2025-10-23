import { ApiResponse } from "../types";
import api from "./api";

export interface ConsumerCenter {
  id: string | number;
  name: string;
  address?: string;
  phone?: string;
  district?: string;
  lat?: number | null;
  lng?: number | null;
}

export const consumersApi = {
  /**
   * GET /api/consumers
   * Optional filter by district using query param `?district=...`
   */
  getConsumers: async (
    district?: string
  ): Promise<ApiResponse<ConsumerCenter[]>> => {
    const params: Record<string, string> = {};
    if (district) params.district = district;

    try {
      const response = await api.get("/api/consumers", { params });
      const payload = response.data;
      if (Array.isArray(payload)) {
        return {
          success: true,
          data: payload as ConsumerCenter[],
          message: "Consumers fetched successfully",
        } as ApiResponse<ConsumerCenter[]>;
      }
      return payload as ApiResponse<ConsumerCenter[]>;
    } catch (error) {
      console.error("Failed to fetch consumers:", error);
      // Fallback to empty data
      return {
        success: true,
        data: [],
        message: "Consumers fetched successfully (fallback)",
      } as ApiResponse<ConsumerCenter[]>;
    }
  },

  /**
   * GET /api/consumers/districts
   * Returns list of districts as strings
   */
  getDistricts: async (): Promise<ApiResponse<string[]>> => {
    try {
      const response = await api.get("/api/consumers/districts");
      const payload = response.data;
      if (Array.isArray(payload)) {
        return {
          success: true,
          data: payload as string[],
          message: "Consumer districts fetched successfully",
        } as ApiResponse<string[]>;
      }
      return payload as ApiResponse<string[]>;
    } catch (error) {
      console.error("Failed to fetch consumer districts:", error);
      // Fallback to empty data
      return {
        success: true,
        data: [],
        message: "Consumer districts fetched successfully (fallback)",
      } as ApiResponse<string[]>;
    }
  },
};

export default consumersApi;
