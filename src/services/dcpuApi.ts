import { ApiResponse } from "../types";
import api from "./api";

export interface DcpuCenter {
  id: string | number;
  district: string;
  organisation: string;
  officer_name: string;
  designation: string;
  mobile?: string | null;
  email?: string | null;
  lat?: string | number | null;
  lng?: string | number | null;
  address: string;
}

export const dcpuApi = {
  // GET /api/dcpu?district=XYZ
  async getDcpus(district?: string): Promise<ApiResponse<DcpuCenter[]>> {
    const response = await api.get("/api/dcpu", {
      params: district ? { district } : {},
    });
    console.log("DCPU API RESPONSE:", response.data);
    const payload = response.data;
    if (Array.isArray(payload)) {
      return {
        success: true,
        data: payload as DcpuCenter[],
        message: "OK",
      } as ApiResponse<DcpuCenter[]>;
    }
    return payload as ApiResponse<DcpuCenter[]>;
  },

  // GET /api/dcpu/districts
  async getDistricts(): Promise<ApiResponse<string[]>> {
    const response = await api.get("/api/dcpu/districts");
    console.log("DCPU DISTRICTS RESPONSE:", response.data);
    const payload = response.data;
    if (Array.isArray(payload)) {
      return { success: true, data: payload, message: "OK" } as ApiResponse<
        string[]
      >;
    }
    return payload as ApiResponse<string[]>;
  },
};

export default dcpuApi;
