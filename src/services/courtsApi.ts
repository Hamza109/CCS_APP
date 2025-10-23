import api from "./api";

export type CourtCoordinate = {
  id: number;
  court_name: string;
  address: string;
  lat: string; // using string to match backend; caller can parseFloat
  lng: string;
  district: string;
};

export const courtsApi = {
  async getCoordinates(district?: string, q?: string) {
    const res = await api.get<CourtCoordinate[]>("/api/courts/coordinates", {
      params: {
        district,
        q,
      },
    });
    return res.data;
  },
  async getDistricts() {
    const res = await api.get<string[]>("/api/courts/districts");
    return res.data;
  },
};

export default courtsApi;
