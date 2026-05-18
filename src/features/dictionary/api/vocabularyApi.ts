import { apiFetch, ApiListResponse, toApiList } from "@/api/client";
import { Vocabulary } from "@/features/dictionary/types";

export async function getAllVocabulary(): Promise<Vocabulary[]> {
  const data = await apiFetch<ApiListResponse<Vocabulary>>("/api/vocabulary");

  return toApiList(data);
}
