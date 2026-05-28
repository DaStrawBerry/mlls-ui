import { InfiniteDisplayer } from "@/components/ui/InfiniteDisplayer";
import {
  KanjiCard,
  LanguageCard,
  VocabCard,
} from "@/features/dictionary/components/cards/DictionaryCard";
import { useKanjiSearch } from "@/features/dictionary/hooks/useKanji";
import { useLanguageSearch } from "@/features/dictionary/hooks/useLanguage";
import { useVocabSearch } from "@/features/dictionary/hooks/useVocab";
import type {
  LanguageResponse,
  SearchAllParams,
} from "@/features/dictionary/types/japanese";
import type {
  KanjiResponse,
  SearchKanjiParams,
} from "@/features/dictionary/types/kanji";
import type {
  SearchVocabParams,
  VocabResponse,
} from "@/features/dictionary/types/vocab";
import { Link } from "expo-router";
import type { ReactElement } from "react";
import { Pressable } from "react-native";

type DictionaryItem = {
  id: string;
  type: string;
};

type DictionarySelectableProps<TItem extends DictionaryItem> = {
  selectMode?: boolean;
  selectedIds?: readonly string[];
  onToggleSelect?: (item: TItem) => void;
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

export default function LanguageDictionary({
  params,
  selectMode,
  selectedIds,
  onToggleSelect,
}: {
  params?: SearchAllParams;
} & DictionarySelectableProps<LanguageResponse>) {
  const query = useLanguageSearch(20, params);

  return (
    <InfiniteDisplayer
      query={query}
      keyExtractor={(item) => item.id}
      loadingText="Loading languages..."
      errorTitle="Failed to load languages"
      errorMessage="Check API URL, backend server, and phone Wi-Fi connection."
      selectMode={selectMode}
      selectedIds={selectedIds}
      onToggleSelect={onToggleSelect}
      renderItem={(item, meta) => {
        const card = <LanguageCard language={item} selected={meta.selected} />;

        if (meta.selectMode) return card;

        return <DictionaryItemLink item={item}>{card}</DictionaryItemLink>;
      }}
    />
  );
}

export function KanjiDictionary({
  params,
  selectMode,
  selectedIds,
  onToggleSelect,
}: {
  params?: SearchKanjiParams;
} & DictionarySelectableProps<KanjiResponse>) {
  const query = useKanjiSearch(20, params);

  return (
    <InfiniteDisplayer
      query={query}
      keyExtractor={(item) => item.id}
      loadingText="Loading kanji..."
      errorTitle="Failed to load kanji"
      errorMessage="Check API URL, backend server, and phone Wi-Fi connection."
      selectMode={selectMode}
      selectedIds={selectedIds}
      onToggleSelect={onToggleSelect}
      renderItem={(item, meta) => {
        const card = <KanjiCard kanji={item} selected={meta.selected} />;

        if (meta.selectMode) return card;

        return <DictionaryItemLink item={item}>{card}</DictionaryItemLink>;
      }}
    />
  );
}

export function VocabDictionary({
  params,
  selectMode,
  selectedIds,
  onToggleSelect,
}: {
  params?: SearchVocabParams;
} & DictionarySelectableProps<VocabResponse>) {
  const query = useVocabSearch(20, params);

  return (
    <InfiniteDisplayer
      query={query}
      keyExtractor={(item) => item.id}
      loadingText="Loading vocabulary..."
      errorTitle="Failed to load vocabulary"
      errorMessage="Check API URL, backend server, and phone Wi-Fi connection."
      selectMode={selectMode}
      selectedIds={selectedIds}
      onToggleSelect={onToggleSelect}
      renderItem={(item, meta) => {
        const card = <VocabCard vocab={item} selected={meta.selected} />;

        if (meta.selectMode) return card;

        return <DictionaryItemLink item={item}>{card}</DictionaryItemLink>;
      }}
    />
  );
}
