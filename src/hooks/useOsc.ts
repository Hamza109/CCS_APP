import { useQuery, useQueryClient } from "@tanstack/react-query";
import { OneStopCentre, oscApi } from "../services/oscApi";
import type { ApiResponse } from "../types";

const oscKey = (district?: string) => ["osc", district || "all"] as const;
const oscDistrictsKey = ["osc", "districts"] as const;

export function useOsc(district?: string) {
  return useQuery<ApiResponse<OneStopCentre[]>>({
    queryKey: oscKey(district),
    queryFn: () => oscApi.getOsc(district),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useOscDistricts() {
  return useQuery<ApiResponse<string[]>>({
    queryKey: oscDistrictsKey,
    queryFn: () => oscApi.getDistricts(),
    staleTime: 1000 * 60 * 60,
  });
}

export function usePrefetchOsc() {
  const qc = useQueryClient();
  return (district?: string) =>
    qc.prefetchQuery({
      queryKey: oscKey(district),
      queryFn: () => oscApi.getOsc(district),
    });
}
