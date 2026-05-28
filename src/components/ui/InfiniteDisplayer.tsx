import type { ReactElement } from "react";
import {
  ActivityIndicator,
  FlatList,
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

type InfiniteDisplayerProps<TItem> = {
  query: InfiniteQuery<TItem>;

  keyExtractor: (item: TItem) => string;
  renderItem: (item: TItem) => ReactElement;

  loadingText?: string;
  emptyText?: string;
  errorTitle?: string;
  errorMessage?: string;
  loadingMoreText?: string;

  contentClassName?: string;
};

export function InfiniteDisplayer<TItem>({
  query,
  keyExtractor,
  renderItem,
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
      renderItem={({ item }) => renderItem(item)}
    />
  );
}
