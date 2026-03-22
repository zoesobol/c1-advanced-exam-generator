import { apiRequest } from "@/lib/api";
import type { Exam } from "@/features/exams/types";

export async function listExams(accessToken: string | null): Promise<Exam[]> {
  return apiRequest<Exam[]>("/exams/", {
    accessToken,
  });
}
