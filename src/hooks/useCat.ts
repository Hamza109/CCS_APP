import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  catApi,
  type CatListParams,
  type CatSearchParams,
} from "../services/catApi";

const queryKeys = {
  root: ["cat"] as const,
  details: (p: CatSearchParams) =>
    [
      "cat",
      "details",
      p.catschemaId,
      p.casetypeId,
      p.caseNo,
      p.caseYear,
    ] as const,
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
      !!params.catschemaId &&
      !!params.casetypeId &&
      !!params.caseNo &&
      !!params.caseYear,
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

const dailyOrdersKeys = {
  root: ["cat", "dailyOrders"] as const,
  list: (p: CatSearchParams) =>
    [
      "cat",
      "dailyOrders",
      p.catschemaId,
      p.casetypeId,
      p.caseNo,
      p.caseYear,
    ] as const,
};

export function useCatDailyOrders(params: CatSearchParams | undefined) {
  return useQuery({
    queryKey: params ? dailyOrdersKeys.list(params) : dailyOrdersKeys.root,
    queryFn: () => {
      if (!params) throw new Error("Missing params");
      return catApi.getDailyOrders(params);
    },
    enabled:
      !!params &&
      !!params.catschemaId &&
      !!params.casetypeId &&
      !!params.caseNo &&
      !!params.caseYear,
    staleTime: 1000 * 60 * 5,
  });
}

const finalOrdersKeys = {
  root: ["cat", "finalOrders"] as const,
  list: (p: CatSearchParams) =>
    [
      "cat",
      "finalOrders",
      p.catschemaId,
      p.casetypeId,
      p.caseNo,
      p.caseYear,
    ] as const,
};

export function useCatFinalOrders(params: CatSearchParams | undefined) {
  return useQuery({
    queryKey: params ? finalOrdersKeys.list(params) : finalOrdersKeys.root,
    queryFn: () => {
      if (!params) throw new Error("Missing params");
      return catApi.getFinalOrders(params);
    },
    enabled:
      !!params &&
      !!params.catschemaId &&
      !!params.casetypeId &&
      !!params.caseNo &&
      !!params.caseYear,
    staleTime: 1000 * 60 * 5,
  });
}

const listKeys = {
  list: (p: CatListParams) =>
    [
      "cat",
      "list",
      p.applicant,
      p.respondentadvocate,
      p.respondent,
      p.applicantadvocate,
      p.sub_category,
      p.id,
      p.page,
      p.per_page,
    ] as const,
};

export function useCatList(params: CatListParams | undefined) {
  return useQuery({
    queryKey: params ? listKeys.list(params) : ["cat", "list"],
    queryFn: () => {
      if (!params) throw new Error("Missing params");
      return catApi.search(params);
    },
    enabled: !!params,
    staleTime: 1000 * 60 * 2,
  });
}

// Debounced suggestions for dynamic dropdowns based on a selected field
export function useCatSuggestions(
  field: keyof CatListParams | undefined,
  term: string,
  baseParams: Omit<CatListParams, "page" | "per_page"> = {}
) {
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebounced(term.trim()), 2000);
    return () => clearTimeout(id);
  }, [term]);

  const params: CatListParams | undefined =
    field && debounced
      ? { ...baseParams, [field]: debounced, per_page: 20, page: 1 }
      : undefined;

  const { data, isLoading, error } = useCatList(params);

  // Build unique option list for the selected field from results
  const options = useMemo(() => {
    if (!field || !data?.data) return [] as { id: string; name: string }[];
    const seen = new Set<string>();
    const arr: { id: string; name: string }[] = [];
    for (const item of data.data) {
      let v: any;
      if (field === "applicant") v = item.applicant;
      else if (field === "applicantadvocate") v = item.applicantadvocate;
      else if (field === "respondent") v = item.respondent;
      else if (field === "respondentadvocate") v = item.respondentadvocate;
      else if (field === "sub_category") v = item.disposalNature; // map to disposalNature
      if (typeof v === "string" && v.trim() && !seen.has(v)) {
        seen.add(v);
        arr.push({ id: v, name: v });
      }
    }
    return arr;
  }, [data, field]);

  return { options, isLoading, error };
}
