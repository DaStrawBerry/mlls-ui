import { CycleSelector } from "@/components/ui/CycleSelector";
import { SearchActionButton } from "@/components/ui/SearchActionButton";
import {
  DictionaryMode,
  JpLevel,
  mapDictionaryModeToJpType,
  SearchAllParams,
} from "@/features/dictionary/types/japanese";
import { SearchKanjiParams } from "@/features/dictionary/types/kanji";
import { SearchVocabParams } from "@/features/dictionary/types/vocab";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export type DictionarySearchAction = "add" | "sync";

const MODE_OPTIONS = [
  { label: "GLOBE", value: "GLOBE" },
  { label: "KANJI", value: "KANJI" },
  { label: "VOCAB", value: "VOCAB" },
] as const;

type BaseSearchKeys = "page" | "size" | "level";

type SearchAllField = Exclude<
  Extract<keyof SearchAllParams, string>,
  BaseSearchKeys
>;
type SearchKanjiField = Exclude<
  Extract<keyof SearchKanjiParams, string>,
  BaseSearchKeys
>;
type SearchVocabField = Exclude<
  Extract<keyof SearchVocabParams, string>,
  BaseSearchKeys
>;

type SearchField = SearchAllField | SearchKanjiField | SearchVocabField;

type Option<T extends string> = {
  label: string;
  value: T;
};

const FIELD_OPTIONS_BY_MODE = {
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
} satisfies {
  GLOBE: readonly Option<SearchAllField>[];
  KANJI: readonly Option<SearchKanjiField>[];
  VOCAB: readonly Option<SearchVocabField>[];
};

type LevelOption = "ALL" | JpLevel;

const LEVEL_OPTIONS = [
  { label: "ALL", value: "ALL" },
  { label: " N1", value: "N1" },
  { label: " N2", value: "N2" },
  { label: " N3", value: "N3" },
  { label: " N4", value: "N4" },
  { label: " N5", value: "N5" },
] as const satisfies readonly Option<LevelOption>[];

type SearchHeaderProps = {
  mode: DictionaryMode;
  action: DictionarySearchAction;
  selectMode: boolean;
  selectedCount?: number;
  syncing?: boolean;
  onModeChange: (mode: DictionaryMode) => void;
  onSearch: (
    params: SearchAllParams | SearchKanjiParams | SearchVocabParams,
  ) => void;
  onActionToggle: () => void;
  onSyncModeToggle: () => void;
  onProceedSync: () => void;
};

export function SearchHeader({
  mode,
  action,
  selectMode,
  selectedCount = 0,
  syncing = false,
  onModeChange,
  onSearch,
  onActionToggle,
  onSyncModeToggle,
  onProceedSync,
}: SearchHeaderProps) {
  const router = useRouter();

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

  function handleAdd() {
    const safeType = mapDictionaryModeToJpType(mode);

    router.push({
      pathname: "/language/[type]/add",
      params: {
        type: safeType,
      },
    });
  }

  function handleActionPress() {
    if (action === "add") {
      handleAdd();
      return;
    }

    onSyncModeToggle();
  }

  return (
    <View className="mb-4 gap-3">
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
        <Pressable
          onPress={handleSearch}
          disabled={syncing}
          className="rounded-xl bg-gray-900 px-4 py-2 disabled:opacity-50"
        >
          <Ionicons name="search" size={20} color="white" />
        </Pressable>
      </View>

      <View className="flex-row justify-between">
        <SearchActionButton
          action={action}
          count={action === "sync" ? selectedCount : undefined}
          disabled={syncing}
          dropdownDisabled={syncing}
          showDropdownTrigger
          onDropdownPress={onActionToggle}
          onPress={handleActionPress}
        />

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
      </View>

      {selectMode ? (
        <View className="flex-row items-center justify-between rounded-xl bg-blue-50 px-3 py-2">
          <Text className="text-sm font-semibold text-blue-700">
            {selectedCount} selected
          </Text>

          <Pressable
            onPress={onProceedSync}
            disabled={selectedCount === 0 || syncing}
            className="rounded-xl bg-blue-600 px-4 py-2 disabled:opacity-50"
          >
            <Text className="text-sm font-bold text-white">
              {syncing ? "Syncing..." : "Proceed sync"}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
