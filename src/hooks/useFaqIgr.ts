import { useInfiniteQuery } from "@tanstack/react-query";
import {
  DEFAULT_FAQ_PER_PAGE,
  faqIgrApi,
  FaqPage,
} from "../services/faqIgrApi";
import type { ApiResponse } from "../types";

export function useFaqIgr(q: string) {
  return useInfiniteQuery<ApiResponse<FaqPage>>({
    queryKey: ["faq-igr", q || ""],
    queryFn: ({ pageParam }) =>
      faqIgrApi.getFaqs({
        page: pageParam ?? 1,
        per_page: DEFAULT_FAQ_PER_PAGE,
        q,
      }),
    getNextPageParam: (last) => {
      const p = last.data;
      if (p.hasMore) return (p.page ?? 1) + 1;
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
