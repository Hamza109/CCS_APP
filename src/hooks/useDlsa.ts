import { useQuery, useQueryClient } from "@tanstack/react-query";
import { dlsaApi } from "../services/dlsaApi";

const DLSA_QUERY_KEY = "dlsa";

export function useDlsaContacts(district?: string) {
  return useQuery({
    queryKey: [DLSA_QUERY_KEY, district || "all"],
    queryFn: () => dlsaApi.getContacts(district),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export function useDlsaDistricts() {
  return useQuery({
    queryKey: [DLSA_QUERY_KEY, "districts"],
    queryFn: () => dlsaApi.getDistricts(),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
}

export function usePrefetchDlsaContacts() {
  const qc = useQueryClient();
  return (district?: string) =>
    qc.prefetchQuery({
      queryKey: [DLSA_QUERY_KEY, district || "all"],
      queryFn: () => dlsaApi.getContacts(district),
    });
}
