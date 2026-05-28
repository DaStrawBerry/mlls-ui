import { PageResponse } from "@/api/client";
import { searchCells } from "@/api/library/cell";
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { CellResponse } from "../types/cell";
import { LibSearchParams } from "../types/memory";

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
