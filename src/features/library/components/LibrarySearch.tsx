import { CycleSelector } from "@/components/ui/CycleSelector";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import type { LibMode, LibSearchParams } from "../types/memory";
import { LibraryActionButtons } from "./LibButton";

const MODE_OPTIONS = [
  { label: "SHELF", value: "SHELF" },
  { label: "STSET", value: "STSET" },
  { label: "CELLS", value: "CELLS" },
] as const;

type LibrarySearchHeaderProps = {
  mode: LibMode;
  onModeChange: (mode: LibMode) => void;
  onSearch: (params: LibSearchParams) => void;
};

export function LibrarySearchHeader({
  mode,
  onModeChange,
  onSearch,
}: LibrarySearchHeaderProps) {
  const [searchText, setSearchText] = useState("");

  const params = useMemo<LibSearchParams>(() => {
    const trimmedText = searchText.trim();

    if (!trimmedText) {
      return {};
    }

    return {
      param: trimmedText,
    };
  }, [searchText]);

  function handleSearch() {
    onSearch(params);
  }

  return (
    <View className="mb-4 gap-3">
      <View className="flex-row items-center gap-2">
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          placeholder="Search library..."
          placeholderTextColor="#D1D5DB"
          returnKeyType="search"
          className="flex-1 rounded-xl border border-gray-200 bg-white p-2 text-base text-gray-800"
        />

        <Pressable
          onPress={handleSearch}
          className="rounded-xl bg-gray-900 px-4 py-2"
        >
          <Ionicons name="search" size={20} color="white" />
        </Pressable>
      </View>

      <View className="flex-row justify-between">
        <LibraryActionButtons mode={mode} />
        <CycleSelector
          label="Mode: "
          value={mode}
          options={[...MODE_OPTIONS]}
          onChange={onModeChange}
          width={120}
        />
      </View>
    </View>
  );
}
