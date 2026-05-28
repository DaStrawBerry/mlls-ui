import { apiFetch, emptyToNull, PageResponse } from "@/api/client";
import type { BoxRequest, BoxResponse } from "@/features/library/types/box";
import type { CellResponse } from "@/features/library/types/cell";
import type { LibSearchParams } from "@/features/library/types/memory";

export async function searchShelves(
  page = 0,
  size = 20,
  params?: LibSearchParams,
) {
  return apiFetch<PageResponse<BoxResponse>>(`/api/memory/search/shelf`, {
    method: "POST",
    body: JSON.stringify({
      page,
      size,
      ...emptyToNull(params),
    }),
  });
}

export function createShelf(body: BoxRequest) {
  return apiFetch<BoxResponse>("/api/memory/shelves", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getShelfCells(id: string, page = 0, size = 20) {
  return apiFetch<PageResponse<CellResponse>>(
    `/api/memory/shelves/${id}/cells?page=${page}&size=${size}`,
  );
}

export function moveCellsToShelf(id: string, cellIds: string[]) {
  return apiFetch<BoxResponse>(`/api/memory/shelves/${id}/cells`, {
    method: "PUT",
    body: JSON.stringify(cellIds),
  });
}

export function deleteShelf(id: string) {
  return apiFetch<void>(`/api/memory/shelves/${id}`, {
    method: "DELETE",
  });
}
