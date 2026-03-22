import { apiRequest } from "@/lib/api";
import type { Exam } from "@/features/exams/types";

export async function getExam(
  examId: string,
  accessToken: string | null,
): Promise<Exam> {
  return apiRequest<Exam>(`/exams/${examId}/`, {
    accessToken,
  });
}
