import { useQuery, useQueryClient } from "@tanstack/react-query";
import { districtsApi } from "../services/districtsApi";

const DISTRICTS_QUERY_KEY = "districts";

/**
 * Hook to fetch all districts
 */
export function useDistricts() {
  return useQuery({
    queryKey: [DISTRICTS_QUERY_KEY],
    queryFn: () => districtsApi.getDistricts(),
    staleTime: 1000 * 60 * 60, // 1 hour (districts don't change often)
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

/**
 * Hook to fetch district by ID
 */

/**
 * Hook to fetch districts by region
 */


/**
 * Hook to prefetch districts
 */
export function usePrefetchDistricts() {
  const qc = useQueryClient();
  return () =>
    qc.prefetchQuery({
      queryKey: [DISTRICTS_QUERY_KEY],
      queryFn: () => districtsApi.getDistricts(),
    });
}
