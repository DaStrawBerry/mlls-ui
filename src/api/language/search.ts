import { apiFetch, PageResponse } from "@/api/client";

import type { SearchAllParams } from "@/types/japanese";
import type { KanjiResponse, SearchKanjiParams } from "@/types/kanji";
import type { SearchVocabParams, VocabResponse } from "@/types/vocab";

export function searchAll(page = 0, size = 20, params?: SearchAllParams) {
  return apiFetch<PageResponse<KanjiResponse>>(`/api/search/knowledge`, {
    method: "POST",
    body: JSON.stringify({
      page,
      size,
      ...emptyToNull(params),
    }),
  });
}

export function searchVocab(page = 0, size = 20, params?: SearchVocabParams) {
  return apiFetch<PageResponse<VocabResponse>>(`/api/search/vocabulary`, {
    method: "POST",
    body: JSON.stringify({
      page,
      size,
      ...emptyToNull(params),
    }),
  });
}

export function searchKanji(page = 0, size = 20, params?: SearchKanjiParams) {
  return apiFetch<PageResponse<KanjiResponse>>(`/api/search/kanji`, {
    method: "POST",
    body: JSON.stringify({
      page,
      size,
      ...emptyToNull(params),
    }),
  });
}

type EmptyToNull<T extends object> = {
  [K in keyof T]: T[K] extends "" | undefined ? null : T[K] | null;
};

function emptyToNull<T extends object>(obj?: T): EmptyToNull<T> | undefined {
  if (!obj) return undefined;

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      value === "" || value === undefined ? null : value,
    ]),
  ) as EmptyToNull<T>;
}
