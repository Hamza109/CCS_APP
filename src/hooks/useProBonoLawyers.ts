import { useQuery, useQueryClient } from "@tanstack/react-query";
import { proBonoLawyersApi } from "../services/proBonoLawyersApi";

const PRO_BONO_LAWYERS_QUERY_KEY = "pro-bono-lawyers";

/**
 * Hook to fetch all pro-bono lawyers, optionally filtered by district
 */
export function useProBonoLawyers(district?: string) {
  return useQuery({
    queryKey: [PRO_BONO_LAWYERS_QUERY_KEY, district || "all"],
    queryFn: () => proBonoLawyersApi.getLawyers(district),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch districts where pro-bono lawyers are available
 */
export function useProBonoLawyerDistricts() {
  return useQuery({
    queryKey: [PRO_BONO_LAWYERS_QUERY_KEY, "districts"],
    queryFn: () => proBonoLawyersApi.getDistricts(),
    staleTime: 1000 * 60 * 30, // 30 minutes (districts don't change often)
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Hook to fetch pro-bono lawyer by ID
 */

/**
 * Hook to prefetch pro-bono lawyers
 */
export function usePrefetchProBonoLawyers() {
  const qc = useQueryClient();
  return (district?: string) =>
    qc.prefetchQuery({
      queryKey: [PRO_BONO_LAWYERS_QUERY_KEY, district || "all"],
      queryFn: () => proBonoLawyersApi.getLawyers(district),
    });
}
