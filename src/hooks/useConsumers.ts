import { useQuery, useQueryClient } from "@tanstack/react-query";
import { consumersApi, type ConsumerCenter } from "../services/consumersApi";
import { ApiResponse } from "../types";

const consumersKey = (district?: string) => ["consumers", district || "all"];

export function useConsumers(district?: string) {
  return useQuery<ApiResponse<ConsumerCenter[]>>({
    queryKey: consumersKey(district),
    queryFn: () => consumersApi.getConsumers(district),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function usePrefetchConsumers() {
  const qc = useQueryClient();
  return (district?: string) =>
    qc.prefetchQuery({
      queryKey: consumersKey(district),
      queryFn: () => consumersApi.getConsumers(district),
    });
}

const districtsKey = ["consumer-districts"] as const;

export function useConsumerDistricts() {
  return useQuery({
    queryKey: districtsKey,
    queryFn: () => consumersApi.getDistricts(),
    staleTime: 1000 * 60 * 60,
  });
}
