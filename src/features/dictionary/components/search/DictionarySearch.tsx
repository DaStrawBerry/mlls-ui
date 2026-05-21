import { CycleSelector } from "@/components/ui/CycleSelector";
import { JpLevel, SearchAllParams } from "@/features/dictionary/types/japanese";
import { SearchKanjiParams } from "@/features/dictionary/types/kanji";
import { SearchVocabParams } from "@/features/dictionary/types/vocab";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Pressable, TextInput, View } from "react-native";

export type DictionaryMode = "GLOBE" | "KANJI" | "VOCAB";

type SearchField =
  | "writing"
  | "meaning"
  | "reading"
  | "sino"
  | "kunyomi"
  | "onyomi";

type LevelOption = "ALL" | JpLevel;

const MODE_OPTIONS = [
  { label: "GLOBE", value: "GLOBE" },
  { label: "KANJI", value: "KANJI" },
  { label: "VOCAB", value: "VOCAB" },
] as const;

const LEVEL_OPTIONS = [
  { label: "ALL", value: "ALL" },
  { label: " N1 ", value: "N1" },
  { label: " N2 ", value: "N2" },
  { label: " N3 ", value: "N3" },
  { label: " N4 ", value: "N4" },
  { label: " N5 ", value: "N5" },
] as const;

const FIELD_OPTIONS_BY_MODE: Record<
  DictionaryMode,
  readonly { label: string; value: SearchField }[]
> = {
  GLOBE: [
    { label: "WRITING", value: "writing" },
    { label: "MEANING", value: "meaning" },
  ],
  KANJI: [
    { label: "WRITING", value: "writing" },
    { label: "MEANING", value: "meaning" },
    { label: "SINO   ", value: "sino" },
    { label: "KUNYOMI", value: "kunyomi" },
    { label: "ONYOMI ", value: "onyomi" },
  ],
  VOCAB: [
    { label: "WRITING", value: "writing" },
    { label: "MEANING", value: "meaning" },
    { label: "READING", value: "reading" },
  ],
};

type SearchHeaderProps = {
  mode: DictionaryMode;
  onModeChange: (mode: DictionaryMode) => void;
  onSearch: (
    params: SearchAllParams | SearchKanjiParams | SearchVocabParams,
  ) => void;
};

export function SearchHeader({
  mode,
  onModeChange,
  onSearch,
}: SearchHeaderProps) {
  const [level, setLevel] = useState<LevelOption>("ALL");
  const [searchText, setSearchText] = useState("");
  const [searchField, setSearchField] = useState<SearchField>("writing");

  const fieldOptions = FIELD_OPTIONS_BY_MODE[mode];

  useEffect(() => {
    const stillValid = fieldOptions.some(
      (option) => option.value === searchField,
    );

    if (!stillValid) {
      setSearchField("writing");
    }
  }, [mode, fieldOptions, searchField]);

  const params = useMemo(() => {
    const nextParams: Record<string, string> = {};

    if (level !== "ALL") {
      nextParams.level = level;
    }

    const trimmedText = searchText.trim();

    if (trimmedText) {
      nextParams[searchField] = trimmedText;
    }

    return nextParams;
  }, [level, searchText, searchField]);

  function handleSearch() {
    onSearch(params);
  }

  return (
    <View className="mb-4 gap-3">
      {/* Row 1 */}
      <View className="flex-row items-center gap-2">
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          placeholder={`Search by ${searchField}`}
          placeholderTextColor="#D1D5DB"
          returnKeyType="search"
          className="flex-1 rounded-xl border border-gray-200 bg-white p-2 text-base text-gray-800"
        />
      </View>

      {/* Row 2 */}
      <View className="flex-row justify-between">
        <View className="flex-row gap-2">
          <CycleSelector
            label="Mode: "
            value={mode}
            options={[...MODE_OPTIONS]}
            onChange={onModeChange}
            width={120}
          />
          <CycleSelector
            label="Level: "
            value={level}
            options={[...LEVEL_OPTIONS]}
            onChange={setLevel}
            width={95}
          />

          <CycleSelector
            label="Field: "
            value={searchField}
            options={[...fieldOptions]}
            onChange={setSearchField}
            width={130}
          />
        </View>
        <Pressable
          onPress={handleSearch}
          className="rounded-xl bg-gray-900 py-2 px-4"
        >
          <Ionicons name="search" size={20} color="white" />
        </Pressable>
      </View>
    </View>
  );
}
