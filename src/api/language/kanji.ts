import { apiFetch, PageResponse } from "@/api/client";
import type { KanjiResponse } from "@/types/kanji";

export function getKanji(page = 0, size = 20) {
  return apiFetch<PageResponse<KanjiResponse>>(
    `/api/kanji?page=${page}&size=${size}`,
  );
}

export function getKanjiById(id: string) {
  return apiFetch<KanjiResponse>(`/api/kanji/${id}`);
}
