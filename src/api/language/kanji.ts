import { apiFetch, PageResponse } from "@/api/client";
import type { KanjiResponse } from "@/features/dictionary/types/kanji";
import { KanjiRequest } from "@/features/dictionary/types/kanji";

export function getKanji(page = 0, size = 20) {
  return apiFetch<PageResponse<KanjiResponse>>(
    `/api/kanji?page=${page}&size=${size}`,
  );
}

export function getKanjiById(id: string) {
  return apiFetch<KanjiResponse>(`/api/kanji/${id}`);
}

export function updateKanji(id: string, body: KanjiRequest) {
  return apiFetch<KanjiResponse>(`/api/kanji/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function createKanji(body: KanjiRequest) {
  return apiFetch<KanjiResponse>("/api/kanji", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
