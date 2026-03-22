import { apiRequest } from "@/lib/api";
import type { SectionPayload } from "@/features/exams/types";

export async function generateSection(
  examId: string,
  partCode: string,
  accessToken: string | null,
): Promise<SectionPayload> {
  return apiRequest<SectionPayload>(
    `/exams/${examId}/sections/${partCode}/generate`,
    {
      method: "POST",
      body: {},
      accessToken,
    },
  );
}
