import type { KanjiRequest } from "../types/kanji";

export function createEmptyKanjiForm(): KanjiRequest {
  return {
    tags: [],
    level: "N5",
    writing: "",
    meaning: "",
    sino: "",
    stroke: undefined,
    note: "",
    components: [],
    kunyomi: [],
    onyomi: [],
  };
}

export function mapKanjiResponseToForm(data: {
  tags?: string[];
  level?: KanjiRequest["level"];
  writing?: string;
  meaning?: string;
  sino?: string;
  stroke?: number;
  note?: string;
  components?: {
    writing?: string;
    sino?: string;
    meaning?: string;
  }[];
  kunyomi?: {
    pronounce?: string;
    examples?: {
      writing?: string;
      reading?: string;
      meaning?: string;
    }[];
  }[];
  onyomi?: {
    pronounce?: string;
    examples?: {
      writing?: string;
      reading?: string;
      meaning?: string;
    }[];
  }[];
}): KanjiRequest {
  return {
    tags: data.tags ?? [],
    level: data.level,
    writing: data.writing ?? "",
    meaning: data.meaning ?? "",
    sino: data.sino ?? "",
    stroke: data.stroke,
    note: data.note ?? "",
    components:
      data.components?.map((component) => ({
        writing: component.writing ?? "",
        sino: component.sino ?? "",
        meaning: component.meaning ?? "",
      })) ?? [],
    kunyomi:
      data.kunyomi?.map((group) => ({
        pronounce: group.pronounce ?? "",
        examples:
          group.examples?.map((example) => ({
            writing: example.writing ?? "",
            reading: example.reading ?? "",
            meaning: example.meaning ?? "",
          })) ?? [],
      })) ?? [],
    onyomi:
      data.onyomi?.map((group) => ({
        pronounce: group.pronounce ?? "",
        examples:
          group.examples?.map((example) => ({
            writing: example.writing ?? "",
            reading: example.reading ?? "",
            meaning: example.meaning ?? "",
          })) ?? [],
      })) ?? [],
  };
}

export function cleanKanjiForm(form: KanjiRequest): KanjiRequest {
  return {
    ...form,
    tags: form.tags.map((tag) => tag.trim()).filter(Boolean),
    writing: form.writing.trim(),
    meaning: form.meaning.trim(),
    sino: form.sino?.trim(),
    note: form.note?.trim(),
    components: form.components
      .map((component) => ({
        writing: component.writing.trim(),
        sino: component.sino?.trim(),
        meaning: component.meaning?.trim(),
      }))
      .filter((component) => component.writing),
    kunyomi: cleanPronounceGroups(form.kunyomi),
    onyomi: cleanPronounceGroups(form.onyomi),
  };
}

function cleanPronounceGroups(groups: KanjiRequest["kunyomi"]) {
  return groups
    .map((group) => ({
      pronounce: group.pronounce.trim(),
      examples: group.examples
        .map((example) => ({
          writing: example.writing.trim(),
          reading: example.reading?.trim(),
          meaning: example.meaning?.trim(),
        }))
        .filter((example) => example.writing),
    }))
    .filter((group) => group.pronounce || group.examples.length);
}
