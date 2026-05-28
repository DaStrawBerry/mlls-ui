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
};

export function LanguageCard({ language }: LanguageCardProps) {
  if (!language) return <ErrorInfoCard />;

  return (
    <InfoCard
      item={mapLanguageToInfoCardItem(language)}
      emptyContentText="No meaning yet"
    />
  );
}

type VocabCardProps = {
  vocab?: VocabResponse | null;
};

export function VocabCard({ vocab }: VocabCardProps) {
  if (!vocab) return <ErrorInfoCard />;

  return (
    <InfoCard
      item={mapVocabToInfoCardItem(vocab)}
      titleClassName="text-sm"
      subtitleClassName="text-sm"
      emptyContentText="No meaning yet"
    />
  );
}

type KanjiCardProps = {
  kanji?: KanjiResponse | null;
};

export function KanjiCard({ kanji }: KanjiCardProps) {
  if (!kanji) return <ErrorInfoCard />;

  return (
    <InfoCard
      item={mapKanjiToInfoCardItem(kanji)}
      titleClassName="text-2xl"
      emptyContentText="No meaning yet"
    />
  );
}
