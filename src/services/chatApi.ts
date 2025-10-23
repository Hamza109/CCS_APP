import type { ApiResponse } from "../types";
import api from "./api";

export interface ChatQuestionPayload {
  question: string;
}

export interface ChatAnswerPayload {
  answer: string;
}

// Utility: remove optional <think>...</think> blocks from model answer
export function stripThink(answer: string): string {
  return answer.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
}

export const chatApi = {
  // Posts a question to the local chat server and returns the raw answer
  async askQuestion(
    payload: ChatQuestionPayload
  ): Promise<ApiResponse<ChatAnswerPayload>> {
    const res = await api.post("/api/chat", payload);

    // Normalize to ApiResponse shape if backend returns a plain object
    const body = res.data as any;
    if (body && body.answer !== undefined && body.success === undefined) {
      return { success: true, data: { answer: String(body.answer) } };
    }
    return body as ApiResponse<ChatAnswerPayload>;
  },
};

export default chatApi;
