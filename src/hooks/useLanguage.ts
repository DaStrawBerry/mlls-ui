import { PageResponse } from "@/api/client";
import { searchAll } from "@/api/language/search";
import {
  LanguageResponse,
  SearchAllParams,
} from "@/features/dictionary/types/japanese";
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";

export type LanguageInfiResult = UseInfiniteQueryResult<
  InfiniteData<PageResponse<LanguageResponse>>,
  Error
>;

export function useLanguageSearch(size = 20, params?: SearchAllParams) {
  return useInfiniteQuery<PageResponse<LanguageResponse>, Error>({
    queryKey: ["vocabulary", size, params],
    queryFn: ({ pageParam = 0 }) =>
      searchAll(pageParam as number, size, params),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.page + 1;
    },
  });
}
