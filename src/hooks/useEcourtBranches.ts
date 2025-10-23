import { useInfiniteQuery } from "@tanstack/react-query";
import {
  DEFAULT_ECOURT_PER_PAGE,
  EcourtBranchesPage,
  ecourtBranchesApi,
} from "../services/ecourtBranchesApi";
import type { ApiResponse } from "../types";

export function useEcourtBranches(q: string) {
  return useInfiniteQuery<
    ApiResponse<EcourtBranchesPage>,
    Error,
    ApiResponse<EcourtBranchesPage>,
    [string, string],
    number
  >({
    queryKey: ["ecourt-branches", q || ""],
    queryFn: ({ pageParam }) =>
      ecourtBranchesApi.getBranches({
        page: pageParam ?? 1,
        per_page: DEFAULT_ECOURT_PER_PAGE,
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
