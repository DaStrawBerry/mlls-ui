import { syncKanji, syncVocab } from "@/api/dictionary/sync";
import { moveCellsToShelf } from "@/api/library/shelf";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type SyncDictionaryInput = {
  kanjiIds?: string[];
  vocabIds?: string[];
};

type SyncToShelfInput = SyncDictionaryInput & {
  shelfId: string;
};

export function useSyncDictionaryCells() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ kanjiIds = [], vocabIds = [] }: SyncDictionaryInput) => {
      const [kanjiCells, vocabCells] = await Promise.all([
        kanjiIds.length ? syncKanji(kanjiIds) : Promise.resolve([]),
        vocabIds.length ? syncVocab(vocabIds) : Promise.resolve([]),
      ]);

      return [...kanjiCells, ...vocabCells];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cells"] });
    },
  });
}

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
