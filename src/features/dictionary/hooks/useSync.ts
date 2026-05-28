import { syncKanji, syncVocab } from "@/api/dictionary/sync";
import { moveCellsToShelf } from "@/api/library/shelf";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type SyncToShelfInput = {
  shelfId: string;
  kanjiIds?: string[];
  vocabIds?: string[];
};

export function useSyncDictionaryToShelf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      shelfId,
      kanjiIds = [],
      vocabIds = [],
    }: SyncToShelfInput) => {
      const [kanjiCells, vocabCells] = await Promise.all([
        kanjiIds.length ? syncKanji(kanjiIds) : Promise.resolve([]),
        vocabIds.length ? syncVocab(vocabIds) : Promise.resolve([]),
      ]);

      const cellIds = [...kanjiCells, ...vocabCells].map((cell) => cell.cellId);

      if (!cellIds.length) {
        return {
          synced: [],
          shelf: null,
        };
      }

      const shelf = await moveCellsToShelf(shelfId, cellIds);

      return {
        synced: [...kanjiCells, ...vocabCells],
        shelf,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shelf"] });
      queryClient.invalidateQueries({ queryKey: ["cells"] });
    },
  });
}
