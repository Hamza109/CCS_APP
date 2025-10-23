import { useInfiniteQuery } from "@tanstack/react-query";
import {
  AdvocatesPage,
  DEFAULT_ADVOCATES_PER_PAGE,
  advocatesApi,
} from "../services/advocatesApi";
import type { ApiResponse } from "../types";

export function useAdvocates(q: string) {
  return useInfiniteQuery<
    ApiResponse<AdvocatesPage>,
    Error,
    ApiResponse<AdvocatesPage>,
    [string, string],
    number
  >({
    queryKey: ["advocates", q || ""],
    queryFn: ({ pageParam }) =>
      advocatesApi.getAdvocates({
        page: pageParam ?? 1,
        per_page: DEFAULT_ADVOCATES_PER_PAGE,
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
