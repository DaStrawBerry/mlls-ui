import { apiFetch, emptyToNull, PageResponse } from "@/api/client";
import { BoxParams, BoxResponse } from "@/features/library/types/box";

export async function searchShelves(page = 0, size = 20, params?: BoxParams) {
  return apiFetch<PageResponse<BoxResponse>>(`/api/memory/search/shelf`, {
    method: "POST",
    body: JSON.stringify({
      page,
      size,
      ...emptyToNull(params),
    }),
  });
}
