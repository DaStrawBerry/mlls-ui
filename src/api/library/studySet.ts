import { apiFetch, emptyToNull, PageResponse } from "@/api/client";
import { BoxResponse } from "@/features/library/types/box";
import { LibSearchParams } from "@/features/library/types/memory";

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
