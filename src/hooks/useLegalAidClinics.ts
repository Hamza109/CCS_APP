import { useQuery, useQueryClient } from "@tanstack/react-query";
import { legalAidApi } from "../services/legalAidApi";

const queryKey = (district?: string) => [
  "legal-aid-clinics",
  district || "all",
];

export function useLegalAidClinics(district?: string) {
  return useQuery({
    queryKey: queryKey(district),
    queryFn: () => legalAidApi.getClinics(district),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (previously cacheTime)
  });
}

export function usePrefetchLegalAidClinics() {
  const qc = useQueryClient();
  return (district?: string) =>
    qc.prefetchQuery({
      queryKey: queryKey(district),
      queryFn: () => legalAidApi.getClinics(district),
    });
}
