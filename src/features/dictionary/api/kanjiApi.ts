import { apiFetch, ApiListResponse, toApiList } from "@/api/client";
import { Kanji } from "@/features/dictionary/types";

export async function getAllKanji(): Promise<Kanji[]> {
  const data = await apiFetch<ApiListResponse<Kanji>>("/api/kanji");

  return toApiList(data);
}
