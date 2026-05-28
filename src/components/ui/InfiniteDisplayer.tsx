import { Ionicons } from "@expo/vector-icons";
import type { ReactElement } from "react";
import { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";

export type InfinitePage<TItem> = {
  content: TItem[];
};

export type InfiniteQuery<TItem> = {
  data?: {
    pages: InfinitePage<TItem>[];
  };
  isLoading: boolean;
  error: Error | null;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  refetch: () => void;
  isRefetching: boolean;
};

export type InfiniteRenderItemMeta<TItem> = {
  item: TItem;
  selectMode: boolean;
  selected: boolean;
  toggleSelect: () => void;
};

type InfiniteDisplayerProps<TItem> = {
  query: InfiniteQuery<TItem>;

  keyExtractor: (item: TItem) => string;
  renderItem: (item: TItem, meta: InfiniteRenderItemMeta<TItem>) => ReactElement;

  selectMode?: boolean;
  selectedIds?: readonly string[];
  onToggleSelect?: (item: TItem) => void;

  loadingText?: string;
  emptyText?: string;
  errorTitle?: string;
  errorMessage?: string;
  loadingMoreText?: string;

  contentClassName?: string;
};

function SelectableFrame({
  selected,
  onPress,
  children,
}: {
  selected: boolean;
  onPress: () => void;
  children: ReactElement;
}) {
  return (
    <Pressable onPress={onPress} className="relative">
      <View
        className={[
          "rounded-2xl border-2",
          selected ? "border-blue-500 bg-blue-50" : "border-transparent",
        ].join(" ")}
      >
        <View className="absolute right-3 top-3 z-10 rounded-full bg-white">
          <Ionicons
            name={selected ? "checkbox" : "square-outline"}
            size={24}
            color={selected ? "#2563EB" : "#9CA3AF"}
          />
        </View>

        {children}
      </View>
    </Pressable>
  );
}

export function InfiniteDisplayer<TItem>({
  query,
  keyExtractor,
  renderItem,
  selectMode = false,
  selectedIds = [],
  onToggleSelect,
  loadingText = "Loading...",
  emptyText = "No results found.",
  errorTitle = "Failed to load data",
  errorMessage = "Please check your connection and try again.",
  loadingMoreText = "Loading more...",
  contentClassName,
}: InfiniteDisplayerProps<TItem>) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = query;

  const items = data?.pages.flatMap((page) => page.content) ?? [];
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const handleEndReached = () => {
    if (!hasNextPage || isFetchingNextPage) return;

    fetchNextPage();
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
        <Text className="mt-3 text-gray-600">{loadingText}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-lg font-bold text-red-500">{errorTitle}</Text>
        <Text className="mt-2 text-center text-gray-500">{errorMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={keyExtractor}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.2}
      contentContainerClassName={contentClassName}
      ListEmptyComponent={
        <View className="items-center py-8">
          <Text className="text-gray-500">{emptyText}</Text>
        </View>
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="py-4">
            <ActivityIndicator />
            <Text className="mt-2 text-center text-gray-500">
              {loadingMoreText}
            </Text>
          </View>
        ) : null
      }
      renderItem={({ item }) => {
        const itemId = keyExtractor(item);
        const selected = selectedIdSet.has(itemId);
        const toggleSelect = () => onToggleSelect?.(item);
        const renderedItem = renderItem(item, {
          item,
          selectMode,
          selected,
          toggleSelect,
        });

        if (!selectMode) {
          return renderedItem;
        }

        return (
          <SelectableFrame selected={selected} onPress={toggleSelect}>
            {renderedItem}
          </SelectableFrame>
        );
      }}
    />
  );
}
