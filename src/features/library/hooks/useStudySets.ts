import { PageResponse } from "@/api/client";
import { searchStudySet } from "@/api/library/studySet";
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { BoxResponse } from "../types/box";

import { LibSearchParams } from "../types/memory";

export type StudySetInfiResult = UseInfiniteQueryResult<
  InfiniteData<PageResponse<BoxResponse>>,
  Error
>;

export function useStudySetSearch(
  size = 20,
  params?: LibSearchParams,
): StudySetInfiResult {
  return useInfiniteQuery<PageResponse<BoxResponse>>({
    queryKey: ["stset", size, params],
    queryFn: ({ pageParam = 0 }) =>
      searchStudySet(pageParam as number, size, params),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.page + 1;
    },
  });
}
