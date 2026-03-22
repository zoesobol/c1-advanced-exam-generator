import { apiRequest } from "@/lib/api";
import type { CreateExamPayload, Exam } from "@/features/exams/types";

export async function createExam(
  payload: CreateExamPayload,
  accessToken: string | null,
): Promise<Exam> {
  return apiRequest<Exam>("/exams/", {
    method: "POST",
    body: payload,
    accessToken,
  });
}
