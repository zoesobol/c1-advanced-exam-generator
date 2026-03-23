import { apiRequest } from "@/lib/api";
import type { SubmitSectionResponse } from "@/features/exams/types";

export async function getSectionResults(
  sectionId: string,
  accessToken: string | null,
): Promise<SubmitSectionResponse> {
  return apiRequest<SubmitSectionResponse>(`/sections/${sectionId}/results`, {
    accessToken,
  });
}
