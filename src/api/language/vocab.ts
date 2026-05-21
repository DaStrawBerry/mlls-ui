import { apiFetch, PageResponse } from "@/api/client";
import type { VocabResponse } from "@/features/dictionary/types/vocab";
import { VocabRequest } from "@/features/dictionary/types/vocab";

export function getVocab(
  page = 0,
  size = 20,
): Promise<PageResponse<VocabResponse>> {
  return apiFetch<PageResponse<VocabResponse>>(
    `/api/vocabulary?page=${page}&size=${size}`,
  );
}

export function getVocabById(id: string) {
  return apiFetch<VocabResponse>(`/api/vocabulary/${id}`);
}

export function updateVocab(id: string, body: VocabRequest) {
  return apiFetch<VocabResponse>(`/api/vocabulary/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}
