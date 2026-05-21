import { LanguageResponse, SearchAllParams } from "./japanese";
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
