import { apiFetch, ApiListResponse, toApiList } from "@/api/client";
import { Shelf } from "@/features/library/types";

export async function getShelves(): Promise<Shelf[]> {
  const data = await apiFetch<ApiListResponse<Shelf>>("/api/shelves");

  return toApiList(data);
}
