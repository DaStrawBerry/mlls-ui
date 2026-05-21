import { BaseResponse, SearchAllParams } from "./japanese";
import { VocabResponse } from "./vocab";

export type pronunType = "KUNYOMI" | "ONYOMI";

export interface Pronunciation {
  pType: pronunType;
  pronounce: string;
  examples: VocabResponse;
}

export interface KanjiResponse extends BaseResponse {
  sino: string;
  stroke: number;
  kun: Pronunciation;
  on: Pronunciation;
}

export interface SearchKanjiParams extends SearchAllParams {
  kunyomi: string;
  onyomi: string;
  sino: string;
}
