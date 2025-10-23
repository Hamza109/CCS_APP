import { ApiResponse } from "../types";
import api from "./api";

export interface OneStopCentre {
  id: string | number;
  district_name: string;
  name: string;
  designation: string;
  mobile_number?: string | null;
  alternate_number?: string | null;
  address: string;
  lat?: string | number | null;
  lng?: string | number | null;
}

export const oscApi = {
  async getOsc(district?: string): Promise<ApiResponse<OneStopCentre[]>> {
    const response = await api.get("/api/osc", {
      params: district ? { district } : {},
    });
    const payload = response.data;
    if (Array.isArray(payload)) {
      return { success: true, data: payload, message: "OK" } as ApiResponse<
        OneStopCentre[]
      >;
    }
    return payload as ApiResponse<OneStopCentre[]>;
  },

  async getDistricts(): Promise<ApiResponse<string[]>> {
    const response = await api.get("/api/osc/districts");
    const payload = response.data;
    if (Array.isArray(payload)) {
      return { success: true, data: payload, message: "OK" } as ApiResponse<
        string[]
      >;
    }
    return payload as ApiResponse<string[]>;
  },
};

export default oscApi;
