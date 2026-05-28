import { useState } from "react";
import { View } from "react-native";

import { getErrorMessage, useToast } from "@/components/ui/Toast";
import LanguageDictionary, {
  KanjiDictionary,
  VocabDictionary,
} from "@/features/dictionary/components/search/DictionaryDisplayer";
import {
  DictionarySearchAction,
  SearchHeader,
} from "@/features/dictionary/components/search/DictionarySearch";
import { useSyncDictionaryCells } from "@/features/dictionary/hooks/useSync";
import {
  DictionaryMode,
  LanguageResponse,
  SearchAllParams,
} from "@/features/dictionary/types/japanese";
import { SearchKanjiParams } from "@/features/dictionary/types/kanji";
import { SearchVocabParams } from "@/features/dictionary/types/vocab";
import { useMultiSelect } from "@/hooks/useMultiSelect";

export default function DictionaryScreen() {
  const [mode, setMode] = useState<DictionaryMode>("GLOBE");
  const [action, setAction] = useState<DictionarySearchAction>("add");
  const [selectMode, setSelectMode] = useState(false);

  const [languageParams, setLanguageParams] = useState<SearchAllParams>();
  const [kanjiParams, setKanjiParams] = useState<SearchKanjiParams>();
  const [vocabParams, setVocabParams] = useState<SearchVocabParams>();

  const selection = useMultiSelect<LanguageResponse>();
  const syncMutation = useSyncDictionaryCells();
  const toast = useToast();

  function exitSelectMode() {
    selection.clearSelected();
    setSelectMode(false);
  }

  function handleModeChange(nextMode: DictionaryMode) {
    exitSelectMode();
    setMode(nextMode);
  }

  function handleSearch(
    params: SearchAllParams | SearchKanjiParams | SearchVocabParams,
  ) {
    exitSelectMode();

    if (mode === "GLOBE") {
      setLanguageParams(params as SearchAllParams);
    }

    if (mode === "KANJI") {
      setKanjiParams(params as SearchKanjiParams);
    }

    if (mode === "VOCAB") {
      setVocabParams(params as SearchVocabParams);
    }
  }

  function handleActionToggle() {
    exitSelectMode();
    setAction((current) => (current === "add" ? "sync" : "add"));
  }

  function handleSyncModeToggle() {
    setSelectMode((current) => {
      const next = !current;

      if (!next) {
        selection.clearSelected();
      }

      return next;
    });
  }

  function handleProceedSync() {
    const kanjiIds = selection.selectedItems
      .filter((item) => item.type === "KANJI")
      .map((item) => item.id);

    const vocabIds = selection.selectedItems
      .filter((item) => item.type === "VOCABULARY")
      .map((item) => item.id);

    syncMutation.mutate(
      {
        kanjiIds,
        vocabIds,
      },
      {
        onSuccess: (syncedCells) => {
          exitSelectMode();
          toast.showSuccess(
            "Sync completed",
            `${syncedCells.length} cells synced.`,
          );
        },
        onError: (error) => {
          toast.showError("Sync failed", getErrorMessage(error));
        },
      },
    );
  }

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      <SearchHeader
        mode={mode}
        action={action}
        selectMode={selectMode}
        selectedCount={selection.selectedCount}
        syncing={syncMutation.isPending}
        onModeChange={handleModeChange}
        onSearch={handleSearch}
        onActionToggle={handleActionToggle}
        onSyncModeToggle={handleSyncModeToggle}
        onProceedSync={handleProceedSync}
      />

      {mode === "GLOBE" && (
        <LanguageDictionary
          params={languageParams}
          selectMode={selectMode}
          selectedIds={selection.selectedIds}
          onToggleSelect={selection.toggleSelected}
        />
      )}

      {mode === "KANJI" && (
        <KanjiDictionary
          params={kanjiParams}
          selectMode={selectMode}
          selectedIds={selection.selectedIds}
          onToggleSelect={selection.toggleSelected}
        />
      )}

      {mode === "VOCAB" && (
        <VocabDictionary
          params={vocabParams}
          selectMode={selectMode}
          selectedIds={selection.selectedIds}
          onToggleSelect={selection.toggleSelected}
        />
      )}
    </View>
  );
}
