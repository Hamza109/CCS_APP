import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  DEFAULT_SC_PER_PAGE,
  StandingCounselsPage,
  standingCounselsApi,
} from "../services/standingCounselsApi";
import type { ApiResponse } from "../types";

export function useStandingCounsels(q: string, district?: string) {
  return useInfiniteQuery<
    ApiResponse<StandingCounselsPage>,
    Error,
    ApiResponse<StandingCounselsPage>,
    [string, string, string],
    number
  >({
    queryKey: ["standing-counsels", q || "", district || "all"],
    queryFn: ({ pageParam }) =>
      standingCounselsApi.getCounsels({
        page: pageParam ?? 1,
        per_page: DEFAULT_SC_PER_PAGE,
        q,
        district,
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

export function useStandingCounselDistricts() {
  return useQuery<ApiResponse<string[]>>({
    queryKey: ["standing-counsels", "districts"],
    queryFn: standingCounselsApi.getDistricts,
    staleTime: 1000 * 60 * 60,
  });
}
