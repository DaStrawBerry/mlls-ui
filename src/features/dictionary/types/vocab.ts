import { JpLevel, LanguageResponse, SearchAllParams } from "./japanese";
import type { KanjiComponentResponse } from "./kanji";

export interface VocabComponentResponse {
  id: string;
  writing: string;
  reading?: string;
  meaning?: string;
}

export interface VocabResponse extends LanguageResponse {
  type: "VOCABULARY";
  reading: string;
  kanjiComponents: KanjiComponentResponse[];
  vocabComponents: VocabComponentResponse[];
  collocations: VocabComponentResponse[];
}

export interface SearchVocabParams extends SearchAllParams {
  reading?: string;
}

export type VocabComponentRequest = {
  writing: string;
  meaning?: string;
  reading?: string;
};

export type VocabPronounceRequest = {
  kanji: string;
  type: "ONYOMI" | "KUNYOMI";
  pronounce: string;
};

export type VocabRequest = {
  tags: string[];
  level?: JpLevel;
  note?: string;
  writing: string;
  reading: string;
  meaning: string;
  vocabComps: VocabComponentRequest[];
  pronounces?: VocabPronounceRequest[];
};


