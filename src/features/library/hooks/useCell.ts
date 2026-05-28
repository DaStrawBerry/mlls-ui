import { PageResponse } from "@/api/client";
import { getCellById, searchCells } from "@/api/library/cell";
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useQuery,
} from "@tanstack/react-query";
import type { CellResponse } from "../types/cell";
import type { LibSearchParams } from "../types/memory";

export type CellInfiResult = UseInfiniteQueryResult<
  InfiniteData<PageResponse<CellResponse>>,
  Error
>;

export function useCellSearch(
  size = 20,
  params?: LibSearchParams,
): CellInfiResult {
  return useInfiniteQuery<PageResponse<CellResponse>>({
    queryKey: ["cells", size, params],
    queryFn: ({ pageParam = 0 }) =>
      searchCells(pageParam as number, size, params),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.page + 1;
    },
  });
}

export function useCellDetail(id: string) {
  return useQuery({
    queryKey: ["cell", id],
    queryFn: () => getCellById(id),
    enabled: !!id,
  });
}