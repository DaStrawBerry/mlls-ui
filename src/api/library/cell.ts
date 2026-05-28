import { apiFetch, emptyToNull, PageResponse } from "@/api/client";
import type {
  CellBoxRequest,
  CellBoxResponse,
  CellResponse,
} from "@/features/library/types/cell";
import type { LibSearchParams } from "@/features/library/types/memory";

export async function searchCells(
  page = 0,
  size = 20,
  params?: LibSearchParams,
) {
  return apiFetch<PageResponse<CellResponse>>(`/api/memory/search/cell`, {
    method: "POST",
    body: JSON.stringify({
      page,
      size,
      ...emptyToNull(params),
    }),
  });
}

export function getCellById(id: string) {
  return apiFetch<CellResponse>(`/api/cell/${id}?id=${id}`);
}

export function createCells(body: CellBoxRequest) {
  return apiFetch<CellBoxResponse>("/api/cell", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function deleteCell(id: string) {
  return apiFetch<void>(`/api/cell/${id}`, {
    method: "DELETE",
  });
}

export function deleteCells(ids: string[]) {
  return apiFetch<void>("/api/cell/bulk-delete", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}


