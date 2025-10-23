import { ApiResponse } from "../types";
import api from "./api";

export interface NotaryItem {
  id: number | string;
  sr_no?: number;
  professional_address: string;
  authorized_area: string;
  contact_no?: string;
  district: string;
}

export interface NotariesPage {
  data: NotaryItem[];
  page: number;
  per_page: number;
  total?: number;
  hasMore?: boolean;
}

export const DEFAULT_NOTARIES_PER_PAGE = 20;

export const notariesApi = {
  async getNotaries({
    page = 1,
    per_page = DEFAULT_NOTARIES_PER_PAGE,
    q = "",
  }: {
    page?: number;
    per_page?: number;
    q?: string;
  }): Promise<ApiResponse<NotariesPage>> {
    const params: Record<string, any> = { page, per_page };
    if (q && q.trim()) params.q = q.trim();
    const response = await api.get("/api/notaries", { params });
    const payload = response.data as any;

    const normalize = (raw: any): NotaryItem => ({
      id: raw.id ?? raw.sr_no ?? raw._id ?? Math.random().toString(36).slice(2),
      sr_no: raw.sr_no,
      professional_address: raw.professional_address ?? "",
      authorized_area: raw.authorized_area ?? "",
      contact_no: raw.contact_no ?? "",
      district: raw.district ?? "",
    });

    if (Array.isArray(payload)) {
      const data = (payload as any[]).map(normalize);
      return {
        success: true,
        data: { data, page, per_page, hasMore: data.length === per_page },
      } as ApiResponse<NotariesPage>;
    }

    const items = (payload.data ?? payload.items ?? []).map(normalize);
    const pageData: NotariesPage = {
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
      } as ApiResponse<NotariesPage>;
    }
    return { success: true, data: pageData } as ApiResponse<NotariesPage>;
  },
};

export default notariesApi;
