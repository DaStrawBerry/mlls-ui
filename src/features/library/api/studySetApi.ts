import { apiFetch, ApiListResponse, toApiList } from "@/api/client";
import { StudySet } from "@/features/library/types";

export async function getStudySets(): Promise<StudySet[]> {
  const data = await apiFetch<ApiListResponse<StudySet>>("/api/study-sets");

  return toApiList(data);
}
