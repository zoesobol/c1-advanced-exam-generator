import { apiRequest } from "@/lib/api";
import type {
  SectionPayload,
  SubmitSectionPayload,
  SubmitSectionResponse,
} from "@/features/exams/types";

export async function getSection(
  examId: string,
  partCode: string,
  accessToken: string | null,
): Promise<SectionPayload> {
  return apiRequest<SectionPayload>(`/exams/${examId}/sections/${partCode}/`, {
    accessToken,
  });
}

export async function submitSection(
  sectionId: string,
  payload: SubmitSectionPayload,
  accessToken: string | null,
): Promise<SubmitSectionResponse> {
  return apiRequest<SubmitSectionResponse>(`/sections/${sectionId}/submit`, {
    method: "POST",
    body: payload,
    accessToken,
  });
}
