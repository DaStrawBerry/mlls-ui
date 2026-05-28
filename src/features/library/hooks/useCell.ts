import { PageResponse } from "@/api/client";
import {
  createCells,
  deleteCells,
  getCellById,
  searchCells,
} from "@/api/library/cell";
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  CellBoxRequest,
  CellBoxResponse,
  CellResponse,
} from "../types/cell";
import type { LibSearchParams } from "../types/memory";

export type CellInfiResult = UseInfiniteQueryResult<
  InfiniteData<PageResponse<CellResponse>>,
  Error
>;

function invalidateCellQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["cell"] });
  queryClient.invalidateQueries({ queryKey: ["cells"] });
  queryClient.invalidateQueries({ queryKey: ["shelf"] });
  queryClient.invalidateQueries({ queryKey: ["stset"] });
  queryClient.invalidateQueries({ queryKey: ["library-box-cells"] });
}

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

export function useCreateCells() {
  const queryClient = useQueryClient();

  return useMutation<CellBoxResponse, Error, CellBoxRequest>({
    mutationFn: (body) => createCells(body),
    onSuccess: () => {
      invalidateCellQueries(queryClient);
    },
  });
}

export function useDeleteCells() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string[]>({
    mutationFn: (ids) => deleteCells(ids),
    onSuccess: () => {
      invalidateCellQueries(queryClient);
    },
  });
}
