import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Registrar, registrarsApi } from "../services/registrarsApi";
import type { ApiResponse } from "../types";

const key = (district?: string, division?: string) =>
  ["registrars", district || "all", division || "all"] as const;
const districtsKey = ["registrars", "districts"] as const;

export function useRegistrars(district?: string, division?: string) {
  return useQuery<ApiResponse<Registrar[]>>({
    queryKey: key(district, division),
    queryFn: () => registrarsApi.getRegistrars(district, division),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useRegistrarDistricts() {
  return useQuery<ApiResponse<string[]>>({
    queryKey: districtsKey,
    queryFn: () => registrarsApi.getDistricts(),
    staleTime: 1000 * 60 * 60,
  });
}

export function usePrefetchRegistrars() {
  const qc = useQueryClient();
  return (district?: string, division?: string) =>
    qc.prefetchQuery({
      queryKey: key(district, division),
      queryFn: () => registrarsApi.getRegistrars(district, division),
    });
}
