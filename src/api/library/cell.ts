import { apiFetch, emptyToNull, PageResponse } from "@/api/client";
import { CellParams, CellResponse } from "@/features/library/types/cell";

export async function searchCells(page = 0, size = 20, params?: CellParams) {
  return apiFetch<PageResponse<CellResponse>>(`/api/memory/search/cell`, {
    method: "POST",
    body: JSON.stringify({
      page,
      size,
      ...emptyToNull(params),
    }),
  });
}
