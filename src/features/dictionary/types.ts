export type JlptLevel = "N1" | "N2" | "N3" | "N4" | "N5";

export type Kanji = {
  id: string;
  writing: string;
  meaning?: string;
  sino?: string;
  stroke?: number;
  note?: string;
  level?: JlptLevel;
};

export type Vocabulary = {
  id: string;
  term: string;
  reading?: string;
  meaning?: string;
  level?: JlptLevel;
};
