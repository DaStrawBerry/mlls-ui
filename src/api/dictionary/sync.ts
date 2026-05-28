import { apiFetch } from "@/api/client";
import type { SyncedCellResponse } from "@/features/dictionary/types/sync";

export function syncVocab(ids: string[]) {
  return apiFetch<SyncedCellResponse[]>("/api/sync/vocab", {
    method: "POST",
    body: JSON.stringify(ids),
  });
}

export function syncKanji(ids: string[]) {
  return apiFetch<SyncedCellResponse[]>("/api/sync/kanji", {
    method: "POST",
    body: JSON.stringify(ids),
  });
}
