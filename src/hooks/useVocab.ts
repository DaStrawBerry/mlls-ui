import { PageResponse } from "@/api/client";
// import { getVocab } from "@/api/language/vocab";
import { VocabResponse } from "@/features/dictionary/types/vocab";
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useQuery,
} from "@tanstack/react-query";

import { searchVocab } from "@/api/language/search";
import { getVocabById } from "@/api/language/vocab";
import { SearchVocabParams } from "@/features/dictionary/types/vocab";

export type VocabInfiResult = UseInfiniteQueryResult<
  InfiniteData<PageResponse<VocabResponse>>,
  Error
>;

//search
export function useVocabSearch(
  size = 20,
  params?: SearchVocabParams,
): VocabInfiResult {
  return useInfiniteQuery<PageResponse<VocabResponse>, Error>({
    queryKey: ["vocabulary", size, params],
    queryFn: ({ pageParam = 0 }) =>
      searchVocab(pageParam as number, size, params),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.page + 1;
    },
  });
}

export function useVocabDetail(id: string) {
  return useQuery({
    queryKey: ["vocabulary", id],
    queryFn: () => getVocabById(id),
    enabled: !!id,
  });
}
