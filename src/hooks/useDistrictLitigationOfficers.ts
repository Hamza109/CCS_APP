import { useQuery, useQueryClient } from "@tanstack/react-query";
import { districtLitigationOfficersApi } from "../services/districtLitigationOfficersApi";

const DISTRICT_LITIGATION_OFFICERS_QUERY_KEY = "district-litigation-officers";

/**
 * Hook to fetch all district litigation officers, optionally filtered by district
 */
export function useDistrictLitigationOfficers(district?: string) {
  return useQuery({
    queryKey: [DISTRICT_LITIGATION_OFFICERS_QUERY_KEY, district || "all"],
    queryFn: () => districtLitigationOfficersApi.getOfficers(district),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch districts where district litigation officers are available
 */
export function useDistrictLitigationOfficerDistricts() {
  return useQuery({
    queryKey: [DISTRICT_LITIGATION_OFFICERS_QUERY_KEY, "districts"],
    queryFn: () => districtLitigationOfficersApi.getDistricts(),
    staleTime: 1000 * 60 * 30, // 30 minutes (districts don't change often)
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Hook to prefetch district litigation officers
 */
export function usePrefetchDistrictLitigationOfficers() {
  const qc = useQueryClient();
  return (district?: string) =>
    qc.prefetchQuery({
      queryKey: [DISTRICT_LITIGATION_OFFICERS_QUERY_KEY, district || "all"],
      queryFn: () => districtLitigationOfficersApi.getOfficers(district),
    });
}
