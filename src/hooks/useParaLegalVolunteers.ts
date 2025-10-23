import { useQuery, useQueryClient } from "@tanstack/react-query";
import { paraLegalVolunteersApi } from "../services/paraLegalVolunteersApi";

const PARA_LEGAL_VOLUNTEERS_QUERY_KEY = "para-legal-volunteers";

/**
 * Hook to fetch all para legal volunteers, optionally filtered by district
 */
export function useParaLegalVolunteers(district?: string) {
  return useQuery({
    queryKey: [PARA_LEGAL_VOLUNTEERS_QUERY_KEY, district || "all"],
    queryFn: () => paraLegalVolunteersApi.getVolunteers(district),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch districts where para legal volunteers are available
 */
export function useParaLegalVolunteerDistricts() {
  return useQuery({
    queryKey: [PARA_LEGAL_VOLUNTEERS_QUERY_KEY, "districts"],
    queryFn: () => paraLegalVolunteersApi.getDistricts(),
    staleTime: 1000 * 60 * 30, // 30 minutes (districts don't change often)
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Hook to prefetch para legal volunteers
 */
export function usePrefetchParaLegalVolunteers() {
  const qc = useQueryClient();
  return (district?: string) =>
    qc.prefetchQuery({
      queryKey: [PARA_LEGAL_VOLUNTEERS_QUERY_KEY, district || "all"],
      queryFn: () => paraLegalVolunteersApi.getVolunteers(district),
    });
}
