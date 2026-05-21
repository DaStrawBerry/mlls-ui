export type JpLevel = "N1" | "N2" | "N3" | "N4" | "N5";

export type LanguageType = "KANJI" | "VOCABULARY" | "GRAMMAR";

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
