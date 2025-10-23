import { ApiResponse } from "../types";
import api from "./api";

export interface FaqItem {
  id: number | string;
  question: string;
  answer: string;
}

export interface FaqPage {
  data: FaqItem[];
  page: number;
  per_page: number;
  total?: number;
  hasMore?: boolean;
}

export const DEFAULT_FAQ_PER_PAGE = 20;

export const faqIgrApi = {
  async getFaqs({
    page = 1,
    per_page = DEFAULT_FAQ_PER_PAGE,
    q = "",
  }: {
    page?: number;
    per_page?: number;
    q?: string;
  }): Promise<ApiResponse<FaqPage>> {
    const params: Record<string, any> = { page, per_page };
    if (q && q.trim().length > 0) params.q = q.trim();
    const response = await api.get("/api/faq-igr", { params });
    const payload = response.data as any;

    const normalizeItem = (raw: any): FaqItem => ({
      id: raw.id ?? raw.q_id ?? raw._id ?? String(Math.random()),
      question: raw.question ?? raw.title ?? "",
      answer: raw.answer ?? raw.content ?? "",
    });

    if (Array.isArray(payload)) {
      const data = (payload as any[]).map(normalizeItem);
      return {
        success: true,
        data: {
          data,
          page,
          per_page,
          hasMore: data.length === per_page,
        },
      } as ApiResponse<FaqPage>;
    }

    const pageData: FaqPage = {
      data: (payload.data ?? payload.items ?? []).map(normalizeItem),
      page: payload.page ?? page,
      per_page: payload.per_page ?? per_page,
      total: payload.total,
      hasMore:
        typeof payload.hasMore === "boolean"
          ? payload.hasMore
          : (payload.data ?? payload.items ?? []).length === per_page,
    };

    if (payload.success !== undefined) {
      return {
        success: !!payload.success,
        data: pageData,
      } as ApiResponse<FaqPage>;
    }
    return { success: true, data: pageData } as ApiResponse<FaqPage>;
  },
};

export default faqIgrApi;
