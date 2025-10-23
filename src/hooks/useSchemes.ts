import { useQuery, useQueryClient } from "@tanstack/react-query";
import { schemesApi } from "../services/schemesApi";

const SCHEMES_QUERY_KEY = "schemes";

export function useSchemes() {
  return useQuery({
    queryKey: [SCHEMES_QUERY_KEY],
    queryFn: () => schemesApi.getSchemes(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
}

export function usePrefetchSchemes() {
  const qc = useQueryClient();
  return () =>
    qc.prefetchQuery({
      queryKey: [SCHEMES_QUERY_KEY],
      queryFn: () => schemesApi.getSchemes(),
    });
}




