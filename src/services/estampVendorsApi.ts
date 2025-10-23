import { ApiResponse } from "../types";
import api from "./api";

export interface EstampVendor {
  id: number | string;
  account_name: string;
  acctid: string;
  branchcd: string;
  branch_address: string;
  branch_phone?: string | null;
  account_phone?: string | null;
}

export interface EstampVendorsParams {
  page?: number; // 1-based
  per_page?: number; // default 20
  q?: string;
}

export interface EstampVendorsPage {
  data: EstampVendor[];
  page: number;
  per_page: number;
  total?: number;
  hasMore?: boolean;
}

export const DEFAULT_PER_PAGE = 20;

export const estampVendorsApi = {
  async getVendors(
    params: EstampVendorsParams
  ): Promise<ApiResponse<EstampVendorsPage>> {
    const query = {
      page: params.page ?? 1,
      per_page: params.per_page ?? DEFAULT_PER_PAGE,
      q: params.q ?? "",
    };
    const response = await api.get("/api/estamp-vendors", { params: query });
    const payload = response.data as any;

    // Normalize to ApiResponse<EstampVendorsPage>
    if (Array.isArray(payload)) {
      const data = payload as EstampVendor[];
      return {
        success: true,
        data: {
          data,
          page: query.page,
          per_page: query.per_page,
          hasMore: data.length === query.per_page,
        },
      } as ApiResponse<EstampVendorsPage>;
    }

    // If server already returns a page envelope
    const pageData: EstampVendorsPage = {
      data: payload.data ?? payload.items ?? [],
      page: payload.page ?? query.page,
      per_page: payload.per_page ?? query.per_page,
      total: payload.total,
      hasMore:
        typeof payload.hasMore === "boolean"
          ? payload.hasMore
          : (payload.data ?? payload.items ?? []).length === query.per_page,
    };

    if (payload.success !== undefined) {
      return {
        success: !!payload.success,
        data: pageData,
      } as ApiResponse<EstampVendorsPage>;
    }

    return { success: true, data: pageData } as ApiResponse<EstampVendorsPage>;
  },
};

export default estampVendorsApi;
