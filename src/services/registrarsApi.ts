import { ApiResponse } from "../types";
import api from "./api";

export interface Registrar {
  registrar_id: number | string;
  name: string;
  designation: string;
  mobile_no?: string | null;
  email?: string | null;
  lat?: number | string | null;
  lng?: number | string | null;
  district_name: string;
  division: "jammu" | "kashmir" | string;
  serial_no?: string | null;
}

export const registrarsApi = {
  async getRegistrars(
    district?: string,
    division?: string
  ): Promise<ApiResponse<Registrar[]>> {
    const params: Record<string, string> = {};
    if (district) params.district = district;
    if (division) params.division = division;
    const response = await api.get("/api/registrars", {
      params,
    });
    const payload = response.data;
    if (Array.isArray(payload)) {
      return {
        success: true,
        data: payload as Registrar[],
        message: "OK",
      } as ApiResponse<Registrar[]>;
    }
    return payload as ApiResponse<Registrar[]>;
  },

  async getDistricts(): Promise<ApiResponse<string[]>> {
    const response = await api.get("/api/registrars/districts");
    const payload = response.data;
    if (Array.isArray(payload)) {
      return { success: true, data: payload, message: "OK" } as ApiResponse<
        string[]
      >;
    }
    return payload as ApiResponse<string[]>;
  },
};

export default registrarsApi;
