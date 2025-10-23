import { useMutation } from "@tanstack/react-query";
import { chatApi } from "../services/chatApi";
import type { ApiResponse } from "../types";

export function useChat() {
  return useMutation({
    mutationKey: ["chat", "ask"],
    mutationFn: (payload: { question: string }) => chatApi.askQuestion(payload),
  }) as ReturnType<
    typeof useMutation<
      ApiResponse<{ answer: string }>,
      Error,
      { question: string }
    >
  >;
}
