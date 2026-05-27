export type JpLevel = "N1" | "N2" | "N3" | "N4" | "N5";

export type LanguageType = "KANJI" | "VOCABULARY" | "GRAMMAR";

export type DictionaryMode = "GLOBE" | "KANJI" | "VOCAB";

export function mapDictionaryModeToJpType(
  mode: DictionaryMode | undefined | null
): LanguageType {
  switch (mode) {
    case "KANJI":
      return "KANJI";

    case "VOCAB":
      return "VOCABULARY";

    default:
      return "VOCABULARY";
  }
}

export interface LanguageResponse {
  id: string;
  type: LanguageType;
  level: JpLevel;
  tags: string[];
  writing: string;
  meaning: string;
  note?: string;
}

export type SearchAllParams = {
  level?: JpLevel;
  writing?: string;
  meaning?: string;
};
