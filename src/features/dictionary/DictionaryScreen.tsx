import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import LanguageDictionary, {
  KanjiDictionary,
  VocabDictionary,
} from "@/features/dictionary/components/search/DictionaryDisplayer";
import {
  DictionaryMode,
  SearchHeader,
} from "@/features/dictionary/components/search/DictionarySearch";
import { SearchAllParams } from "@/features/dictionary/types/japanese";
import { SearchKanjiParams } from "@/features/dictionary/types/kanji";
import { SearchVocabParams } from "@/features/dictionary/types/vocab";

export default function DictionaryScreen() {
  const [mode, setMode] = useState<DictionaryMode>("GLOBE");

  const [languageParams, setLanguageParams] = useState<SearchAllParams>();
  const [kanjiParams, setKanjiParams] = useState<SearchKanjiParams>();
  const [vocabParams, setVocabParams] = useState<SearchVocabParams>();

  function handleSearch(
    params: SearchAllParams | SearchKanjiParams | SearchVocabParams,
  ) {
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

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      <SearchHeader
        mode={mode}
        onModeChange={setMode}
        onSearch={handleSearch}
      />

      {mode === "GLOBE" && <LanguageDictionary params={languageParams} />}

      {mode === "KANJI" && <KanjiDictionary params={kanjiParams} />}

      {mode === "VOCAB" && <VocabDictionary params={vocabParams} />}
    </View>
  );
}

type ModeButtonProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function ModeButton({ label, active, onPress }: ModeButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-full px-4 py-2 ${
        active ? "bg-black" : "bg-gray-200"
      }`}
    >
      <Text className={active ? "text-white" : "text-gray-700"}>{label}</Text>
    </TouchableOpacity>
  );
}
