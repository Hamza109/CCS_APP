import { useMutation } from "@tanstack/react-query";
import {
  lawDeptContactApi,
  LawDeptContactPayload,
  LawDeptContactResponse,
} from "../services/lawDeptContactApi";

export function useSubmitLawDeptContact() {
  return useMutation<
    { data: LawDeptContactResponse },
    any,
    LawDeptContactPayload
  >({
    mutationFn: (payload: LawDeptContactPayload) =>
      lawDeptContactApi.submitContact(payload),
  });
}
