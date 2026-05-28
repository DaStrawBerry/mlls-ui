import { ErrorInfoCard, InfoCard } from "@/components/ui/InfoCard";
import type { LanguageResponse } from "@/features/dictionary/types/japanese";
import type { KanjiResponse } from "@/features/dictionary/types/kanji";
import type { VocabResponse } from "@/features/dictionary/types/vocab";

import {
  mapKanjiToInfoCardItem,
  mapLanguageToInfoCardItem,
  mapVocabToInfoCardItem,
} from "./dictionaryCardMapper";

type LanguageCardProps = {
  language?: LanguageResponse | null;
  selected?: boolean;
};

export function LanguageCard({ language, selected }: LanguageCardProps) {
  if (!language) return <ErrorInfoCard />;

  return (
    <InfoCard
      item={mapLanguageToInfoCardItem(language)}
      emptyContentText="No meaning yet"
      className={selected ? "mb-3 border-blue-500 bg-blue-50" : undefined}
    />
  );
}

type VocabCardProps = {
  vocab?: VocabResponse | null;
  selected?: boolean;
};

export function VocabCard({ vocab, selected }: VocabCardProps) {
  if (!vocab) return <ErrorInfoCard />;

  return (
    <InfoCard
      item={mapVocabToInfoCardItem(vocab)}
      titleClassName="text-sm"
      subtitleClassName="text-sm"
      emptyContentText="No meaning yet"
      className={selected ? "mb-3 border-blue-500 bg-blue-50" : undefined}
    />
  );
}

type KanjiCardProps = {
  kanji?: KanjiResponse | null;
  selected?: boolean;
};

export function KanjiCard({ kanji, selected }: KanjiCardProps) {
  if (!kanji) return <ErrorInfoCard />;

  return (
    <InfoCard
      item={mapKanjiToInfoCardItem(kanji)}
      titleClassName="text-2xl"
      emptyContentText="No meaning yet"
      className={selected ? "mb-3 border-blue-500 bg-blue-50" : undefined}
    />
  );
}


