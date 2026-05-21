import { LanguageResponse, SearchAllParams } from "./japanese";

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
