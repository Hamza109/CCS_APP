import { ApiResponse } from "../types";
import api from "./api";

export interface LawOfficerItem {
  id: number | string;
  name: string;
  district?: string;
  designation?: string | null;
  address?: string | null;
  contact_no?: string | null;
  email_id?: string | null;
}

export interface LawOfficersPage {
  data: LawOfficerItem[];
  page: number;
  per_page: number;
  total?: number;
  hasMore?: boolean;
}

export const DEFAULT_LAW_OFFICERS_PER_PAGE = 20;

const normalize = (raw: any): LawOfficerItem => ({
  id: raw.id ?? raw.sr_no ?? raw._id ?? Math.random().toString(36).slice(2),
  name: raw.name ?? raw.officer_name ?? raw.advocate_name ?? "",
  district: raw.district ?? raw.district_name ?? undefined,
  designation: raw.designation ?? raw.role ?? null,
  address: raw.address ?? raw.office_address ?? null,
  contact_no: raw.contact_no ?? raw.phone ?? raw.mobile_no ?? null,
  email_id: raw.email_id ?? raw.email_address ?? raw.email ?? null,
});

export const lawOfficersApi = {
  async getLawOfficers({
    page = 1,
    per_page = DEFAULT_LAW_OFFICERS_PER_PAGE,
    q = "",
  }: {
    page?: number;
    per_page?: number;
    q?: string;
  }): Promise<ApiResponse<LawOfficersPage>> {
    const params: Record<string, any> = { page, per_page };
    if (q && q.trim()) params.q = q.trim();

    const response = await api.get("/api/law-officers", { params });
    const payload = response.data as any;

    if (Array.isArray(payload)) {
      const data = (payload as any[]).map(normalize);
      return {
        success: true,
        data: { data, page, per_page, hasMore: data.length === per_page },
      } as ApiResponse<LawOfficersPage>;
    }

    const items = (payload.data ?? payload.items ?? []).map(normalize);
    const pageData: LawOfficersPage = {
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
      } as ApiResponse<LawOfficersPage>;
    }
    return { success: true, data: pageData } as ApiResponse<LawOfficersPage>;
  },
};

export default lawOfficersApi;
