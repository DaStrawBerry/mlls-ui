import { apiFetch, PageResponse } from "@/api/client";
import type { VocabResponse } from "@/features/dictionary/types/vocab";
import { VocabRequest } from "@/features/dictionary/types/vocab";

export function getVocab(
  page = 0,
  size = 20,
): Promise<PageResponse<VocabResponse>> {
  return apiFetch<PageResponse<VocabResponse>>(
    `/api/language/vocabulary?page=${page}&size=${size}`,
  );
}

export function getVocabById(id: string) {
  return apiFetch<VocabResponse>(`/api/language/vocabulary/${id}`);
}

export function updateVocab(id: string, body: VocabRequest) {
  return apiFetch<VocabResponse>(`/api/language/vocabulary/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function createVocab(body: VocabRequest) {
  return apiFetch<VocabResponse>("/api/language/vocabulary", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
