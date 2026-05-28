import type { InfoCardBaseItem } from "@/components/ui/InfoCard";
import type { LanguageResponse } from "@/features/dictionary/types/japanese";
import type { KanjiResponse } from "@/features/dictionary/types/kanji";
import type { VocabResponse } from "@/features/dictionary/types/vocab";

export function mapLanguageToInfoCardItem(
  language: LanguageResponse,
): InfoCardBaseItem {
  return {
    title: language.writing,
    subtitle: language.type,
    badge: language.level,
    content: language.meaning,
  };
}

export function mapVocabToInfoCardItem(vocab: VocabResponse): InfoCardBaseItem {
  return {
    title: vocab.writing,
    subtitle: vocab.reading,
    badge: vocab.level,
    content: vocab.meaning,
  };
}

export function mapKanjiToInfoCardItem(kanji: KanjiResponse): InfoCardBaseItem {
  return {
    title: kanji.writing,
    subtitle: kanji.sino,
    badge: kanji.level,
    content: kanji.meaning,
  };
}
