import { useInfiniteQuery } from "@tanstack/react-query";
import {
  DEFAULT_PER_PAGE,
  estampVendorsApi,
  EstampVendorsPage,
} from "../services/estampVendorsApi";
import type { ApiResponse } from "../types";

export function useEstampVendors(q: string) {
  return useInfiniteQuery<
    ApiResponse<EstampVendorsPage>,
    Error,
    ApiResponse<EstampVendorsPage>,
    [string, string],
    number
  >({
    queryKey: ["estamp-vendors", q || ""],
    queryFn: ({ pageParam }) =>
      estampVendorsApi.getVendors({
        page: pageParam ?? 1,
        per_page: DEFAULT_PER_PAGE,
        q,
      }),
    getNextPageParam: (lastPage) => {
      const p = lastPage.data;
      if (p.hasMore) return (p.page ?? 1) + 1;
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
