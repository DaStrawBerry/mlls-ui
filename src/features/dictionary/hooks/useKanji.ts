import { PageResponse } from "@/api/client";
import { createKanji, getKanjiById, updateKanji } from "@/api/dictionary/kanji";
import { searchKanji } from "@/api/dictionary/search";
import {
  KanjiRequest,
  KanjiResponse,
  SearchKanjiParams,
} from "@/features/dictionary/types/kanji";
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export type KanjiInfiResult = UseInfiniteQueryResult<
  InfiniteData<PageResponse<KanjiResponse>>,
  Error
>;

export function useKanjiSearch(
  size = 20,
  params?: SearchKanjiParams,
): KanjiInfiResult {
  return useInfiniteQuery<PageResponse<KanjiResponse>, Error>({
    queryKey: ["vocabulary", size, params],
    queryFn: ({ pageParam = 0 }) =>
      searchKanji(pageParam as number, size, params),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.page + 1;
    },
  });
}

export function useKanjiDetail(id: string) {
  return useQuery({
    queryKey: ["kanji", id],
    queryFn: () => getKanjiById(id),
    enabled: !!id,
  });
}

export function useUpdateKanji() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: KanjiRequest }) =>
      updateKanji(id, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["kanji", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["kanji"] });
      queryClient.invalidateQueries({ queryKey: ["language"] });
    },
  });
}

export function useCreateKanji() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: KanjiRequest) => createKanji(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kanji"] });
      queryClient.invalidateQueries({ queryKey: ["language"] });
    },
  });
}
