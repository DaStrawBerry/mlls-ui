import { apiFetch, emptyToNull, PageResponse } from "@/api/client";
import type { BoxRequest, BoxResponse } from "@/features/library/types/box";
import type { CellResponse } from "@/features/library/types/cell";
import type { LibSearchParams } from "@/features/library/types/memory";

export async function searchStudySet(
  page = 0,
  size = 20,
  params?: LibSearchParams,
) {
  return apiFetch<PageResponse<BoxResponse>>(`/api/memory/search/study`, {
    method: "POST",
    body: JSON.stringify({
      page,
      size,
      ...emptyToNull(params),
    }),
  });
}

export function createStudySet(body: BoxRequest) {
  return apiFetch<BoxResponse>("/api/memory/study-sets", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getStudySetCells(id: string, page = 0, size = 20) {
  return apiFetch<PageResponse<CellResponse>>(
    `/api/memory/study-sets/${id}/cells?page=${page}&size=${size}`,
  );
}

export function addCellsToStudySet(id: string, cellIds: string[]) {
  return apiFetch<BoxResponse>(`/api/memory/study-sets/${id}/cells`, {
    method: "POST",
    body: JSON.stringify(cellIds),
  });
}
