import { getVocab } from "@/api/language/vocab";
import { useInfiniteQuery } from "@tanstack/react-query";

import { searchVocab } from "@/api/language/search";
import { SearchVocabParams } from "@/types/vocab";

//infinite scroll
export function useVocabInfi(size = 20) {
  return useInfiniteQuery({
    queryKey: ["vocabulary", size],
    queryFn: ({ pageParam = 0 }) => getVocab(pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.page + 1;
    },
  });
}

//search
export function useVocabSearch(size = 20, params?: SearchVocabParams) {
  return useInfiniteQuery({
    queryKey: ["vocabulary", size],
    queryFn: ({ pageParam = 0 }) => searchVocab(pageParam, size, params),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.page + 1;
    },
  });
}
