import { useInfiniteQuery } from "@tanstack/react-query";
import {
  DEFAULT_NOTARIES_PER_PAGE,
  NotariesPage,
  notariesApi,
} from "../services/notariesApi";
import type { ApiResponse } from "../types";

export function useNotaries(q: string) {
  return useInfiniteQuery<
    ApiResponse<NotariesPage>,
    Error,
    ApiResponse<NotariesPage>,
    [string, string],
    number
  >({
    queryKey: ["notaries", q || ""],
    queryFn: ({ pageParam }) =>
      notariesApi.getNotaries({
        page: pageParam ?? 1,
        per_page: DEFAULT_NOTARIES_PER_PAGE,
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
