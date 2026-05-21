import {
  KanjiCard,
  LanguageCard,
  VocabCard,
} from "@/features/dictionary/components/cards/DictionaryCard";
import { useKanjiSearch } from "@/features/dictionary/hooks/useKanji";
import { useLanguageSearch } from "@/features/dictionary/hooks/useLanguage";
import type { SearchAllParams } from "@/features/dictionary/types/japanese";
import type { SearchKanjiParams } from "@/features/dictionary/types/kanji";
import type { SearchVocabParams } from "@/features/dictionary/types/vocab";
import { useVocabSearch } from "@/features/dictionary/hooks/useVocab";
import { Link } from "expo-router";
import type { ReactElement } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";

type DictionaryItem = {
  id: string;
  type: string;
};

type InfiniteDisplayerProps<TItem extends DictionaryItem> = {
  query: {
    data?: {
      pages: {
        content: TItem[];
      }[];
    };
    isLoading: boolean;
    error: Error | null;
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    refetch: () => void;
    isRefetching: boolean;
  };
  loadingText?: string;
  emptyText?: string;
  errorTitle?: string;
  renderItem: (item: TItem) => ReactElement;
};

function DictionaryItemLink<TItem extends DictionaryItem>({
  item,
  children,
}: {
  item: TItem;
  children: ReactElement;
}) {
  return (
    <Link
      href={{
        pathname: "/language/[type]/[id]",
        params: {
          type: item.type,
          id: item.id,
        },
      }}
      asChild
    >
      <Pressable>{children}</Pressable>
    </Link>
  );
}

function InfiniteDisplayer<TItem extends DictionaryItem>({
  query,
  loadingText = "Loading...",
  emptyText = "No results found.",
  errorTitle = "Failed to load data",
  renderItem,
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
        <Text className="mt-2 text-center text-gray-500">
          Check API URL, backend server, and phone Wi-Fi connection.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.2}
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
              Loading more...
            </Text>
          </View>
        ) : null
      }
      renderItem={({ item }) => renderItem(item)}
    />
  );
}

export default function LanguageDictionary({
  params,
}: {
  params?: SearchAllParams;
}) {
  const query = useLanguageSearch(20, params);

  return (
    <InfiniteDisplayer
      query={query}
      loadingText="Loading languages..."
      errorTitle="Failed to load languages"
      renderItem={(item) => (
        <DictionaryItemLink item={item}>
          <LanguageCard language={item} />
        </DictionaryItemLink>
      )}
    />
  );
}

export function KanjiDictionary({ params }: { params?: SearchKanjiParams }) {
  const query = useKanjiSearch(20, params);

  return (
    <InfiniteDisplayer
      query={query}
      loadingText="Loading kanji..."
      errorTitle="Failed to load kanji"
      renderItem={(item) => (
        <DictionaryItemLink item={item}>
          <KanjiCard kanji={item} />
        </DictionaryItemLink>
      )}
    />
  );
}

export function VocabDictionary({ params }: { params?: SearchVocabParams }) {
  const query = useVocabSearch(20, params);

  return (
    <InfiniteDisplayer
      query={query}
      loadingText="Loading vocabulary..."
      errorTitle="Failed to load vocabulary"
      renderItem={(item) => (
        <DictionaryItemLink item={item}>
          <VocabCard vocab={item} />
        </DictionaryItemLink>
      )}
    />
  );
}
