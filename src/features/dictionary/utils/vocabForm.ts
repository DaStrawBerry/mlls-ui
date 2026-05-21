import type { VocabRequest } from "../types/vocab";

export function createEmptyVocabForm(): VocabRequest {
  return {
    tags: [],
    level: "N5",
    note: "",
    writing: "",
    reading: "",
    meaning: "",
    kanjiComps: [],
    vocabComps: [],
    pronounces: [],
  };
}

export function mapVocabResponseToForm(data: {
  tags?: string[];
  level?: VocabRequest["level"];
  note?: string;
  writing?: string;
  reading?: string;
  meaning?: string;
  kanjiComponents?: {
    writing?: string;
    sino?: string;
    meaning?: string;
  }[];
  vocabComponents?: {
    writing?: string;
    reading?: string;
    meaning?: string;
  }[];
}): VocabRequest {
  return {
    tags: data.tags ?? [],
    level: data.level,
    note: data.note ?? "",
    writing: data.writing ?? "",
    reading: data.reading ?? "",
    meaning: data.meaning ?? "",
    kanjiComps:
      data.kanjiComponents?.map((component) => ({
        writing: component.writing ?? "",
        sino: component.sino ?? "",
        meaning: component.meaning ?? "",
      })) ?? [],
    vocabComps:
      data.vocabComponents?.map((component) => ({
        writing: component.writing ?? "",
        reading: component.reading ?? "",
        meaning: component.meaning ?? "",
      })) ?? [],
    pronounces: [],
  };
}

export function cleanVocabForm(form: VocabRequest): VocabRequest {
  return {
    ...form,
    tags: form.tags.map((tag) => tag.trim()).filter(Boolean),
    note: form.note?.trim(),
    writing: form.writing.trim(),
    reading: form.reading.trim(),
    meaning: form.meaning.trim(),
    kanjiComps: form.kanjiComps
      .map((component) => ({
        writing: component.writing.trim(),
        sino: component.sino?.trim(),
        meaning: component.meaning?.trim(),
      }))
      .filter((component) => component.writing),
    vocabComps: form.vocabComps
      .map((component) => ({
        writing: component.writing.trim(),
        reading: component.reading?.trim(),
        meaning: component.meaning?.trim(),
      }))
      .filter((component) => component.writing),
    pronounces: form.pronounces ?? [],
  };
}
