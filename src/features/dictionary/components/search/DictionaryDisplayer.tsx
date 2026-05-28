import { InfiniteDisplayer } from "@/components/ui/InfiniteDisplayer";
import {
  KanjiCard,
  LanguageCard,
  VocabCard,
} from "@/features/dictionary/components/cards/DictionaryCard";
import { useKanjiSearch } from "@/features/dictionary/hooks/useKanji";
import { useLanguageSearch } from "@/features/dictionary/hooks/useLanguage";
import { useVocabSearch } from "@/features/dictionary/hooks/useVocab";
import type { SearchAllParams } from "@/features/dictionary/types/japanese";
import type { SearchKanjiParams } from "@/features/dictionary/types/kanji";
import type { SearchVocabParams } from "@/features/dictionary/types/vocab";
import { Link } from "expo-router";
import type { ReactElement } from "react";
import { Pressable } from "react-native";

type DictionaryItem = {
  id: string;
  type: string;
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
}: {
  params?: SearchAllParams;
}) {
  const query = useLanguageSearch(20, params);

  return (
    <InfiniteDisplayer
      query={query}
      keyExtractor={(item) => item.id}
      loadingText="Loading languages..."
      errorTitle="Failed to load languages"
      errorMessage="Check API URL, backend server, and phone Wi-Fi connection."
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
      keyExtractor={(item) => item.id}
      loadingText="Loading kanji..."
      errorTitle="Failed to load kanji"
      errorMessage="Check API URL, backend server, and phone Wi-Fi connection."
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
      keyExtractor={(item) => item.id}
      loadingText="Loading vocabulary..."
      errorTitle="Failed to load vocabulary"
      errorMessage="Check API URL, backend server, and phone Wi-Fi connection."
      renderItem={(item) => (
        <DictionaryItemLink item={item}>
          <VocabCard vocab={item} />
        </DictionaryItemLink>
      )}
    />
  );
}
