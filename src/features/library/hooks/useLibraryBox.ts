import { PageResponse } from "@/api/client";
import {
  createShelf,
  deleteShelf,
  getShelfCells,
  moveCellsToShelf,
} from "@/api/library/shelf";
import {
  addCellsToStudySet,
  createStudySet,
  deleteStudySet,
  getStudySetCells,
  removeCellsFromStudySet,
} from "@/api/library/studySet";
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

function invalidateLibrary(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["shelf"] });
  queryClient.invalidateQueries({ queryKey: ["stset"] });
  queryClient.invalidateQueries({ queryKey: ["cells"] });
  queryClient.invalidateQueries({ queryKey: ["library-box-cells"] });
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
      invalidateLibrary(queryClient);
    },
  });
}

export function useDeleteLibraryBox(type: LibGroupMode) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => {
      if (type === "SHELF") {
        return deleteShelf(id);
      }

      return deleteStudySet(id);
    },
    onSuccess: () => {
      invalidateLibrary(queryClient);
    },
  });
}

export function useMoveCellsToShelf() {
  const queryClient = useQueryClient();

  return useMutation<
    BoxResponse,
    Error,
    {
      shelfId: string;
      cellIds: string[];
    }
  >({
    mutationFn: ({ shelfId, cellIds }) => moveCellsToShelf(shelfId, cellIds),
    onSuccess: () => {
      invalidateLibrary(queryClient);
    },
  });
}

export function useAddCellsToStudySet() {
  const queryClient = useQueryClient();

  return useMutation<
    BoxResponse,
    Error,
    {
      studySetId: string;
      cellIds: string[];
    }
  >({
    mutationFn: ({ studySetId, cellIds }) =>
      addCellsToStudySet(studySetId, cellIds),
    onSuccess: () => {
      invalidateLibrary(queryClient);
    },
  });
}

export function useRemoveCellsFromStudySet() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    {
      studySetId: string;
      cellIds: string[];
    }
  >({
    mutationFn: ({ studySetId, cellIds }) =>
      removeCellsFromStudySet(studySetId, cellIds),
    onSuccess: () => {
      invalidateLibrary(queryClient);
    },
  });
}
