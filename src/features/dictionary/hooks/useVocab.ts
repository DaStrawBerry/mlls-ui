import { PageResponse } from "@/api/client";
// import { getVocab } from "@/api/language/vocab";
import { VocabRequest, VocabResponse } from "@/features/dictionary/types/vocab";
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { searchVocab } from "@/api/language/search";
import { createVocab, getVocabById, updateVocab } from "@/api/language/vocab";
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

export function useUpdateVocab() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: VocabRequest }) =>
      updateVocab(id, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vocab", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["vocab"] });
      queryClient.invalidateQueries({ queryKey: ["language"] });
    },
  });
}

export function useCreateVocab() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: VocabRequest) => createVocab(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vocab"] });
      queryClient.invalidateQueries({ queryKey: ["language"] });
    },
  });
}
