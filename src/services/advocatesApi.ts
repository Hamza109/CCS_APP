import { ApiResponse } from "../types";
import api from "./api";

export interface AdvocateItem {
  id: number | string;
  name: string;
  district?: string;
  address?: string;
  contact_no?: string | null;
  email_id?: string | null;
  enrollment_no?: string | null;
}

export interface AdvocatesPage {
  data: AdvocateItem[];
  page: number;
  per_page: number;
  total?: number;
  hasMore?: boolean;
}

export const DEFAULT_ADVOCATES_PER_PAGE = 20;

const normalize = (raw: any): AdvocateItem => ({
  id: raw.id ?? raw.sr_no ?? raw._id ?? Math.random().toString(36).slice(2),
  name: raw.name ?? raw.advocate_name ?? raw.counsel_name ?? "",
  district: raw.district ?? raw.district_name ?? undefined,
  address: raw.address ?? raw.professional_address ?? undefined,
  contact_no: raw.contact_no ?? raw.phone ?? raw.mobile_no ?? null,
  email_id: raw.email_id ?? raw.email ?? null,
  enrollment_no: raw.enrollment_no ?? raw.enrolment_no ?? null,
});

export const advocatesApi = {
  async getAdvocates({
    page = 1,
    per_page = DEFAULT_ADVOCATES_PER_PAGE,
    q = "",
  }: {
    page?: number;
    per_page?: number;
    q?: string;
  }): Promise<ApiResponse<AdvocatesPage>> {
    const params: Record<string, any> = { page, per_page };
    if (q && q.trim()) params.q = q.trim();

    const response = await api.get("/api/advocates", { params });
    const payload = response.data as any;

    if (Array.isArray(payload)) {
      const data = (payload as any[]).map(normalize);
      return {
        success: true,
        data: { data, page, per_page, hasMore: data.length === per_page },
      } as ApiResponse<AdvocatesPage>;
    }

    const items = (payload.data ?? payload.items ?? []).map(normalize);
    const pageData: AdvocatesPage = {
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
      } as ApiResponse<AdvocatesPage>;
    }
    return { success: true, data: pageData } as ApiResponse<AdvocatesPage>;
  },
};

export default advocatesApi;
