import { apiFetch, PageResponse } from "@/api/client";
import type { VocabResponse } from "@/types/vocab";

export function getVocab(page = 0, size = 20) {
  return apiFetch<PageResponse<VocabResponse>>(
    `/api/vocabulary?page=${page}&size=${size}`,
  );
}

export function getVocabularyById(id: string) {
  return apiFetch<VocabResponse>(`/api/vocabulary/${id}`);
}
