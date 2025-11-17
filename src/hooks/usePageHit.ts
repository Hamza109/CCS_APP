import { useMutation } from "@tanstack/react-query";
import {
  pageHitsApi,
  type PageHitPayload,
  type PageHitResponse,
} from "../services/pageHitsApi";

export function usePageHit() {
  return useMutation<PageHitResponse, Error, PageHitPayload>({
    mutationFn: (payload) => pageHitsApi.send(payload),
  });
}
