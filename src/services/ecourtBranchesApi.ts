import { ApiResponse } from "../types";
import api from "./api";

export interface EcourtBranch {
  id: number | string;
  name?: string;
  branch_name?: string;
  district?: string;
  address?: string;
  phone?: string;
}

export interface EcourtBranchesPage {
  data: EcourtBranch[];
  page: number;
  per_page: number;
  total?: number;
  hasMore?: boolean;
}

export const DEFAULT_ECOURT_PER_PAGE = 20;

const normalizeItem = (raw: any): EcourtBranch => ({
  id:
    raw.id ??
    raw.branch_id ??
    raw._id ??
    `${
      raw.name ?? raw.branch_name ?? raw.account_name ?? "branch"
    }-${Math.random()}`,
  name: raw.name ?? raw.branch_name ?? raw.account_name ?? raw.title ?? "",
  branch_name: raw.branch_name ?? raw.name ?? raw.account_name ?? "",
  district: raw.district ?? raw.district_name ?? raw.branch_location ?? "",
  address: raw.address ?? raw.location ?? "",
  phone: raw.phone ?? raw.contact ?? raw.mobile ?? raw.mobile_no ?? "",
});

export const ecourtBranchesApi = {
  async getBranches({
    page = 1,
    per_page = DEFAULT_ECOURT_PER_PAGE,
    q = "",
  }: {
    page?: number;
    per_page?: number;
    q?: string;
  }): Promise<ApiResponse<EcourtBranchesPage>> {
    const params: Record<string, any> = { page, per_page };
    if (q && q.trim()) params.q = q.trim();

    const response = await api.get("/api/ecourt-branches", { params });
    const payload = response.data as any;

    if (Array.isArray(payload)) {
      const data = (payload as any[]).map(normalizeItem);
      return {
        success: true,
        data: { data, page, per_page, hasMore: data.length === per_page },
      } as ApiResponse<EcourtBranchesPage>;
    }

    const items = (payload.data ?? payload.items ?? []).map(normalizeItem);
    const pageData: EcourtBranchesPage = {
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
      } as ApiResponse<EcourtBranchesPage>;
    }
    return { success: true, data: pageData } as ApiResponse<EcourtBranchesPage>;
  },
};

export default ecourtBranchesApi;
