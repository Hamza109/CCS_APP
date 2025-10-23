import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  highCourtApi,
  type HighCourtCnrParams,
  type HighCourtSearchParams,
} from "../services/highCourtApi";

const queryKeys = {
  root: ["highCourt"] as const,
  details: (p: HighCourtSearchParams) =>
    [
      "highCourt",
      "details",
      p.est_code,
      p.case_type,
      p.reg_year,
      p.reg_no,
    ] as const,
  cnr: (p: HighCourtCnrParams) => ["highCourt", "cnr", p.cino] as const,
};

export function useHighCourtCaseDetails(
  params: HighCourtSearchParams | undefined
) {
  return useQuery({
    queryKey: params ? queryKeys.details(params) : queryKeys.root,
    queryFn: () => {
      if (!params) throw new Error("Missing params");
      return highCourtApi.getCaseDetails(params);
    },
    enabled:
      !!params &&
      !!params.est_code &&
      !!params.case_type &&
      !!params.reg_year &&
      !!params.reg_no,
    staleTime: 1000 * 60 * 5,
  });
}

export function usePrefetchHighCourtCaseDetails() {
  const qc = useQueryClient();
  return (params: HighCourtSearchParams) =>
    qc.prefetchQuery({
      queryKey: queryKeys.details(params),
      queryFn: () => highCourtApi.getCaseDetails(params),
    });
}

export function useHighCourtCnrDetails(params: HighCourtCnrParams | undefined) {
  return useQuery({
    queryKey: params ? queryKeys.cnr(params) : queryKeys.root,
    queryFn: () => {
      if (!params) throw new Error("Missing params");
      return highCourtApi.getCnrDetails(params);
    },
    enabled: !!params && !!params.cino,
    staleTime: 1000 * 60 * 5,
  });
}

export function usePrefetchHighCourtCnrDetails() {
  const qc = useQueryClient();
  return (params: HighCourtCnrParams) =>
    qc.prefetchQuery({
      queryKey: queryKeys.cnr(params),
      queryFn: () => highCourtApi.getCnrDetails(params),
    });
}
