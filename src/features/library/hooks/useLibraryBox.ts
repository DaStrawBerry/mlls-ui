import { PageResponse } from "@/api/client";
import { createShelf, getShelfCells } from "@/api/library/shelf";
import { createStudySet, getStudySetCells } from "@/api/library/studySet";
import type { BoxRequest, BoxResponse } from "@/features/library/types/box";
import type { CellResponse } from "@/features/library/types/cell";
import type { LibGroupMode } from "@/features/library/types/memory";
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export type BoxCellsInfiResult = UseInfiniteQueryResult<
  InfiniteData<PageResponse<CellResponse>>,
  Error
>;

export function useLibraryBoxCells(
  type: LibGroupMode,
  id: string,
  size = 20,
): BoxCellsInfiResult {
  return useInfiniteQuery<PageResponse<CellResponse>, Error>({
    queryKey: ["library-box-cells", type, id, size],
    queryFn: ({ pageParam = 0 }) => {
      if (type === "SHELF") {
        return getShelfCells(id, pageParam as number, size);
      }

      return getStudySetCells(id, pageParam as number, size);
    },
    enabled: !!id,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.page + 1;
    },
  });
}

export function useCreateLibraryBox(type: LibGroupMode) {
  const queryClient = useQueryClient();

  return useMutation<BoxResponse, Error, BoxRequest>({
    mutationFn: (body) => {
      if (type === "SHELF") {
        return createShelf(body);
      }

      return createStudySet(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shelf"] });
      queryClient.invalidateQueries({ queryKey: ["stset"] });
    },
  });
}
