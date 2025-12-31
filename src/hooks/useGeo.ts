import { useQuery } from "@tanstack/react-query";
import { geoApi } from "../services/geoApi";

const GEO_KEY = "geo";

/**
 * Hook to fetch all states
 * @returns Query result with states data, loading state, and error
 */
export function useStates() {
  return useQuery({
    queryKey: [GEO_KEY, "states"],
    queryFn: async () => {
      const response = await geoApi.getStates();
      const states = response.data || [];
      console.log("📋 useStates - Extracted states:", states.length, "items");
      console.log(
        "📋 useStates - States data:",
        JSON.stringify(states, null, 2)
      );
      return states;
    },
    staleTime: 1000 * 60 * 60, // 1 hour - states don't change often
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 2, // Retry failed requests twice
  });
}

/**
 * Hook to fetch districts by state ID
 * @param stateId - State ID to get districts for
 * @returns Query result with districts data, loading state, and error
 */
export function useDistrictsByState(stateId?: number) {
  return useQuery({
    queryKey: [GEO_KEY, "districts", stateId ?? null],
    queryFn: async () => {
      if (!stateId || stateId <= 0) {
        return [];
      }
      const response = await geoApi.getDistrictsByState(stateId);
      return response.data || [];
    },
    enabled: typeof stateId === "number" && stateId > 0,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 2, // Retry failed requests twice
  });
}
