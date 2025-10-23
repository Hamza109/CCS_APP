import { useQuery, useQueryClient } from "@tanstack/react-query";
import { catApi, type CatSearchParams } from "../services/catApi";

const queryKeys = {
  root: ["cat"] as const,
  details: (p: CatSearchParams) =>
    ["cat", "details", p.caseNo, p.caseYear, p.caseType, p.location] as const,
};

export function useCatCaseDetails(params: CatSearchParams | undefined) {
  return useQuery({
    queryKey: params ? queryKeys.details(params) : queryKeys.root,
    queryFn: () => {
      if (!params) throw new Error("Missing params");
      return catApi.getCaseDetails(params);
    },
    enabled:
      !!params &&
      !!params.caseNo &&
      !!params.caseYear &&
      !!params.caseType &&
      !!params.location,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function usePrefetchCatCaseDetails() {
  const qc = useQueryClient();
  return (params: CatSearchParams) =>
    qc.prefetchQuery({
      queryKey: queryKeys.details(params),
      queryFn: () => catApi.getCaseDetails(params),
    });
}
