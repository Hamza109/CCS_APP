import { useInfiniteQuery } from "@tanstack/react-query";
import {
  DEFAULT_LAW_OFFICERS_PER_PAGE,
  LawOfficersPage,
  lawOfficersApi,
} from "../services/lawOfficersApi";
import type { ApiResponse } from "../types";

export function useLawOfficers(q: string) {
  return useInfiniteQuery<
    ApiResponse<LawOfficersPage>,
    Error,
    ApiResponse<LawOfficersPage>,
    [string, string],
    number
  >({
    queryKey: ["law-officers", q || ""],
    queryFn: ({ pageParam }) =>
      lawOfficersApi.getLawOfficers({
        page: pageParam ?? 1,
        per_page: DEFAULT_LAW_OFFICERS_PER_PAGE,
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
