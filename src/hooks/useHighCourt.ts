import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import hcCasesApi, { type HighCourtListParams } from "../services/hcCasesApi";
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

const listKeys = {
  list: (p: HighCourtListParams) =>
    [
      "highCourt",
      "list",
      p.est_code,
      p.case_type,
      p.reg_year,
      p.reg_no,
      p.cino,
      p.pet_name,
      p.pet_adv,
      p.res_name,
      p.res_advocate,
      p.sub_category,
      p.page,
      p.per_page,
    ] as const,
};

export function useHighCourtList(params: HighCourtListParams | undefined) {
  return useQuery({
    queryKey: params ? listKeys.list(params) : ["highCourt", "list"],
    queryFn: () => {
      if (!params) throw new Error("Missing params");
      return hcCasesApi.search(params);
    },
    enabled: !!params,
    staleTime: 1000 * 60 * 2,
  });
}

// Debounced suggestions for dynamic dropdowns based on a selected field
export function useHighCourtSuggestions(
  field: keyof HighCourtListParams | undefined,
  term: string,
  baseParams: Omit<HighCourtListParams, "page" | "per_page"> = {}
) {
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebounced(term.trim()), 1500);
    return () => clearTimeout(id);
  }, [term]);

  const params: HighCourtListParams | undefined =
    field && debounced
      ? { ...baseParams, [field]: debounced, per_page: 20, page: 1 }
      : undefined;

  const { data, isLoading, error } = useHighCourtList(params);

  // Build unique option list for the selected field from results
  const options = useMemo(() => {
    if (!field || !data?.data) return [] as { id: string; name: string }[];
    const seen = new Set<string>();
    const arr: { id: string; name: string }[] = [];
    for (const item of data.data) {
      const v = (item as any)?.[field];
      if (typeof v === "string" && v.trim() && !seen.has(v)) {
        seen.add(v);
        arr.push({ id: v, name: v });
      }
    }
    return arr;
  }, [data, field]);

  return { options, isLoading, error };
}
