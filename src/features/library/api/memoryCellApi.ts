import { apiFetch, ApiListResponse, toApiList } from "@/api/client";
import { MemoryCell } from "@/features/library/types";

export async function getMemoryCells(): Promise<MemoryCell[]> {
  const data = await apiFetch<ApiListResponse<MemoryCell>>("/api/memory-cells");

  return toApiList(data);
}
