import api from "./api";

export type PageHitPayload = {
  page_name: string;
  ip_address?: string;
  browser?: string;
  latitude?: number;
  longitude?: number;
  district?: string;
  state?: string;
  country?: string;
};

export type PageHitResponse = {
  status?: string;
  message?: string;
};

export const pageHitsApi = {
  async send(payload: PageHitPayload): Promise<PageHitResponse> {
    const res = await api.post("/api/page-hits", payload);
    return res.data;
  },
};

export default pageHitsApi;
