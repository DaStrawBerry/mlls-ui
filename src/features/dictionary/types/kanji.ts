import { JpLevel, LanguageResponse, SearchAllParams } from "./japanese";

export interface KanjiComponentResponse {
  id: string;
  writing: string;
  sino?: string;
}

export interface VocabExampleResponse {
  id: string;
  writing: string;
  reading?: string;
  meaning?: string;
}

export interface KanjiPronounceResponse {
  pronounce: string;
  examples: VocabExampleResponse[];
}

export interface KanjiResponse extends LanguageResponse {
  type: "KANJI";
  sino?: string;
  stroke?: number;
  kunyomi: KanjiPronounceResponse[];
  onyomi: KanjiPronounceResponse[];
  components: KanjiComponentResponse[];
}

export interface SearchKanjiParams extends SearchAllParams {
  kunyomi?: string;
  onyomi?: string;
  sino?: string;
}

export type KanjiComponentRequest = {
  writing: string;
  meaning?: string;
  sino?: string;
};

export type KanjiPronounceRequest = {
  pronounce: string;
  examples: {
    writing: string;
    reading?: string;
    meaning?: string;
  }[];
};

export type KanjiRequest = {
  tags: string[];
  level?: JpLevel;
  writing: string;
  meaning: string;
  sino?: string;
  stroke?: number;
  note?: string;
  kunyomi: KanjiPronounceRequest[];
  onyomi: KanjiPronounceRequest[];
  components: KanjiComponentRequest[];
};
