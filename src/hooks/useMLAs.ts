import { useQuery, useQueryClient } from "@tanstack/react-query";
import { mlaApi } from "../services/mlaApi";

export const useMLAs = () => {
  return useQuery({
    queryKey: ["mlas"],
    queryFn: mlaApi.getMLAs,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useMLAById = (id: number) => {
  return useQuery({
    queryKey: ["mla", id],
    queryFn: () => mlaApi.getMLAById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const usePrefetchMLAs = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: ["mlas"],
      queryFn: mlaApi.getMLAs,
      staleTime: 5 * 60 * 1000,
    });
  };
};
