import { useVocabInfi } from "@/hooks/useVocab";
import { useState } from "react";

type DictionaryMode = "ALL" | "KANJI" | "VOCAB";

import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";

export default function DictionaryScreen() {
  const [mode, setMode] = useState<DictionaryMode>("ALL");

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useVocabInfi(20);

  const items = data?.pages.flatMap((page) => page.content) ?? [];

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
        <Text className="mt-3 text-gray-600">Loading vocabulary...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-lg font-bold text-red-500">
          Failed to load vocabulary
        </Text>
        <Text className="mt-2 text-center text-gray-500">
          Check API URL, backend server, and phone Wi-Fi connection.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      <Text className="mb-4 text-3xl font-bold">Dictionary</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4">
              <ActivityIndicator />
              <Text className="mt-2 text-center text-gray-500">
                Loading more...
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View className="mb-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <Text className="text-2xl font-bold">{item.writing}</Text>
            <Text className="mt-1 text-gray-600">{item.reading}</Text>
            <Text className="mt-2 text-gray-900">{item.meaning}</Text>
          </View>
        )}
      />
    </View>
  );
}
/*<View className="flex-1 bg-white px-4 pt-4">
      <Text className="mb-4 text-3xl font-bold">Dictionary</Text>

      <FlatList
        data={data?.content ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-2xl font-bold">{item.writing}</Text>
              <Text className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                {item.level}
              </Text>
            </View>

            <Text className="mt-1 text-base text-gray-600">{item.reading}</Text>

            <Text className="mt-2 text-base text-gray-900">{item.meaning}</Text>
          </View>
        )}
      />
    </View>
 */
