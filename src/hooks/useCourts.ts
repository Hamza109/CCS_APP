import { useQuery, useQueryClient } from "@tanstack/react-query";
import { courtsApi, type CourtCoordinate } from "../services/courtsApi";

const queryKeys = {
  root: ["courts"] as const,
  coordinates: (district?: string, q?: string) =>
    ["courts", "coordinates", district || "all", q || ""] as const,
  districts: ["courts", "districts"] as const,
};

export function useCourtCoordinates(district?: string, q?: string) {
  return useQuery<CourtCoordinate[]>({
    queryKey: queryKeys.coordinates(district, q),
    queryFn: () => courtsApi.getCoordinates(district, q),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCourtDistricts() {
  return useQuery<string[]>({
    queryKey: queryKeys.districts,
    queryFn: () => courtsApi.getDistricts(),
    staleTime: 1000 * 60 * 60, // 1h
  });
}

export function usePrefetchCourtCoordinates() {
  const qc = useQueryClient();
  return (district?: string, q?: string) =>
    qc.prefetchQuery({
      queryKey: queryKeys.coordinates(district, q),
      queryFn: () => courtsApi.getCoordinates(district, q),
    });
}
