import { ApiResponse } from "../types";
import api from "./api";

export interface StandingCounselItem {
  id: number | string;
  district: string;
  serial_no?: string | number | null;
  counsel_name: string;
  allocation_work?: string | null;
  contact_no?: string | null;
  email_id?: string | null;
  designation?: string | null;
  created_at?: string | null;
}

export interface StandingCounselsPage {
  data: StandingCounselItem[];
  page: number;
  per_page: number;
  total?: number;
  hasMore?: boolean;
}

export const DEFAULT_SC_PER_PAGE = 20;

export const standingCounselsApi = {
  async getCounsels({
    page = 1,
    per_page = DEFAULT_SC_PER_PAGE,
    q = "",
    district,
  }: {
    page?: number;
    per_page?: number;
    q?: string;
    district?: string;
  }): Promise<ApiResponse<StandingCounselsPage>> {
    const params: Record<string, any> = { page, per_page };
    if (q && q.trim()) params.q = q.trim();
    if (district) params.district = district;

    const response = await api.get("/api/standing-counsels", { params });
    const payload = response.data as any;

    const normalize = (raw: any): StandingCounselItem => ({
      id:
        raw.id ??
        raw.serial_no ??
        raw._id ??
        Math.random().toString(36).slice(2),
      district: raw.district ?? "",
      serial_no: raw.serial_no ?? null,
      counsel_name: raw.counsel_name ?? "",
      allocation_work: raw.allocation_work ?? null,
      contact_no: raw.contact_no ?? null,
      email_id: raw.email_id ?? null,
      designation: raw.designation ?? null,
      created_at: raw.created_at ?? null,
    });

    if (Array.isArray(payload)) {
      const data = (payload as any[]).map(normalize);
      return {
        success: true,
        data: { data, page, per_page, hasMore: data.length === per_page },
      } as ApiResponse<StandingCounselsPage>;
    }

    const items = (payload.data ?? payload.items ?? []).map(normalize);
    const pageData: StandingCounselsPage = {
      data: items,
      page: payload.page ?? page,
      per_page: payload.per_page ?? per_page,
      total: payload.total,
      hasMore:
        typeof payload.hasMore === "boolean"
          ? payload.hasMore
          : items.length === (payload.per_page ?? per_page),
    };

    if (payload.success !== undefined) {
      return {
        success: !!payload.success,
        data: pageData,
      } as ApiResponse<StandingCounselsPage>;
    }
    return {
      success: true,
      data: pageData,
    } as ApiResponse<StandingCounselsPage>;
  },

  async getDistricts(): Promise<ApiResponse<string[]>> {
    const response = await api.get("/api/standing-counsels/districts");
    const payload = response.data;
    if (Array.isArray(payload)) {
      return { success: true, data: payload, message: "OK" } as ApiResponse<
        string[]
      >;
    }
    return payload as ApiResponse<string[]>;
  },
};

export default standingCounselsApi;
