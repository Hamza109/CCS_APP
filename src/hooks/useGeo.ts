import { useQuery } from "@tanstack/react-query";
import { geoApi } from "../services/geoApi";

const GEO_KEY = "geo";

export function useStates() {
  return useQuery({
    queryKey: [GEO_KEY, "states"],
    queryFn: () => geoApi.getStates(),
    staleTime: 1000 * 60 * 60,
  });
}

export function useDistrictsByState(stateId?: number) {
  return useQuery({
    queryKey: [GEO_KEY, "districts", stateId ?? null],
    queryFn: () => geoApi.getDistrictsByState(stateId as number),
    enabled: typeof stateId === "number" && stateId > 0,
    staleTime: 1000 * 60 * 10,
  });
}

