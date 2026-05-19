export type JpLevel = "N1" | "N2" | "N3" | "N4" | "N5";

export interface BaseResponse {
  id: string;
  type: "KANJI" | "VOCABULARY" | "GRAMMAR";
  level: JpLevel;
  tags: string[];
  writing: string;
  meaning: string;
  note?: string;
}

export type SearchAllParams = {
  level: JpLevel;
  writing: string;
  meaning: string;
}
