import { BaseResponse, SearchAllParams } from "./japanese";

export interface VocabResponse extends BaseResponse {
  reading: string;
}

export interface SearchVocabParams extends SearchAllParams {
  reading: string;
}
