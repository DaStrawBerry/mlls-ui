import { CycleSelector } from "@/components/ui/CycleSelector";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { useShelvesSearch } from "../hooks/useShelves";
import { useStudySetSearch } from "../hooks/useStudySets";
import type { BoxResponse } from "../types/box";
import type { LibGroupMode, LibSearchParams } from "../types/memory";
import { ShelfCard } from "./cards/ShelfCard";
import { StudySetCard } from "./cards/StudySetCard";

const TARGET_OPTIONS = [
  { label: "SHELF", value: "SHELF" },
  { label: "STSET", value: "STSET" },
] as const;

type BoxPickerModalProps = {
  visible: boolean;
  title?: string;
  initialMode?: LibGroupMode;
  onClose: () => void;
  onSelect: (box: BoxResponse, mode: LibGroupMode) => void;
};

function getModeTitle(mode: LibGroupMode) {
  if (mode === "SHELF") return "shelf";
  return "study set";
}

export function BoxPickerModal({
  visible,
  title = "Select target box",
  initialMode = "SHELF",
  onClose,
  onSelect,
}: BoxPickerModalProps) {
  const [mode, setMode] = useState<LibGroupMode>(initialMode);
  const [searchText, setSearchText] = useState("");
  const [committedText, setCommittedText] = useState("");

  useEffect(() => {
    if (!visible) return;

    setMode(initialMode);
    setSearchText("");
    setCommittedText("");
  }, [initialMode, visible]);

  const params = useMemo<LibSearchParams>(() => {
    const param = committedText.trim();
    return param ? { param } : {};
  }, [committedText]);

  const shelfQuery = useShelvesSearch(20, mode === "SHELF" ? params : undefined);
  const studySetQuery = useStudySetSearch(
    20,
    mode === "STSET" ? params : undefined,
  );

  const query = mode === "SHELF" ? shelfQuery : studySetQuery;
  const items = query.data?.pages.flatMap((page) => page.content) ?? [];

  function handleSearch() {
    setCommittedText(searchText);
  }

  function handleEndReached() {
    if (!query.hasNextPage || query.isFetchingNextPage) return;
    query.fetchNextPage();
  }

  function handleSelect(box: BoxResponse) {
    onSelect(box, mode);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <View className="max-h-[82%] rounded-t-3xl bg-white px-4 pb-6 pt-4">
          <View className="mb-3 flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-bold text-gray-900">{title}</Text>
              <Text className="mt-1 text-sm text-gray-500">
                Search by slug or name, then select a {getModeTitle(mode)}.
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full bg-gray-100"
            >
              <Ionicons name="close" size={20} color="#111827" />
            </Pressable>
          </View>

          <View className="mb-3 flex-row items-center gap-2">
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
              placeholder={`Search ${getModeTitle(mode)}...`}
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

          <View className="mb-3 flex-row justify-end">
            <CycleSelector
              label="Target: "
              value={mode}
              options={[...TARGET_OPTIONS]}
              onChange={setMode}
              width={140}
            />
          </View>

          {query.isLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator />
              <Text className="mt-3 text-gray-500">Loading boxes...</Text>
            </View>
          ) : query.error ? (
            <View className="items-center py-8">
              <Text className="font-semibold text-red-500">
                Failed to load boxes.
              </Text>
            </View>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.2}
              ListEmptyComponent={
                <View className="items-center py-8">
                  <Text className="text-gray-500">No boxes found.</Text>
                </View>
              }
              ListFooterComponent={
                query.isFetchingNextPage ? (
                  <View className="py-4">
                    <ActivityIndicator />
                  </View>
                ) : null
              }
              renderItem={({ item }) => (
                <Pressable onPress={() => handleSelect(item)}>
                  {mode === "SHELF" ? (
                    <ShelfCard box={item} />
                  ) : (
                    <StudySetCard box={item} />
                  )}
                </Pressable>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
