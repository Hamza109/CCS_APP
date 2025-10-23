import { useMutation } from "@tanstack/react-query";
import {
  complaintsApi,
  type ComplaintPayload,
  type ComplaintResponse,
} from "../services/complaintsApi";

export function useSubmitComplaint() {
  return useMutation<{ data: ComplaintResponse }, any, ComplaintPayload>({
    mutationFn: (payload: ComplaintPayload) =>
      complaintsApi.submitComplaint(payload),
  });
}
