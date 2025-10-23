import { useQuery, useQueryClient } from "@tanstack/react-query";
import { dcpuApi, DcpuCenter } from "../services/dcpuApi";

const dcpuKey = (district?: string) => ["dcpu", district || "all"] as const;
const dcpuDistrictsKey = ["dcpu", "districts"] as const;

export function useDcpu(district?: string) {
  return useQuery<ApiResponse<DcpuCenter[]>>({
    queryKey: dcpuKey(district),
    queryFn: () => dcpuApi.getDcpus(district),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useDcpuDistricts() {
  return useQuery<ApiResponse<string[]>>({
    queryKey: dcpuDistrictsKey,
    queryFn: () => dcpuApi.getDistricts(),
    staleTime: 1000 * 60 * 60,
  });
}

export function usePrefetchDcpu() {
  const qc = useQueryClient();
  return (district?: string) =>
    qc.prefetchQuery({
      queryKey: dcpuKey(district),
      queryFn: () => dcpuApi.getDcpus(district),
    });
}

// Types from shared ApiResponse
import type { ApiResponse } from "../types";
