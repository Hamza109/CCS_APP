import { useQuery, useQueryClient } from "@tanstack/react-query";
import { literacyClubsApi } from "../services/literacyClubsApi";

const LITERACY_CLUBS_QUERY_KEY = "literacy-clubs";

export function useLiteracyClubs(district?: string) {
  return useQuery({
    queryKey: [LITERACY_CLUBS_QUERY_KEY, district || "all"],
    queryFn: () => literacyClubsApi.getClubs(district),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useLiteracyClubDistricts() {
  return useQuery({
    queryKey: [LITERACY_CLUBS_QUERY_KEY, "districts"],
    queryFn: () => literacyClubsApi.getDistricts(),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
}

export function usePrefetchLiteracyClubs() {
  const qc = useQueryClient();
  return (district?: string) =>
    qc.prefetchQuery({
      queryKey: [LITERACY_CLUBS_QUERY_KEY, district || "all"],
      queryFn: () => literacyClubsApi.getClubs(district),
    });
}
