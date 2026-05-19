import React from "react";

import { Card } from "@/components/ui/Card";

import { KanjiResponse } from "@/types/kanji";
import { VocabResponse } from "@/types/vocab";

type VocabCardProps = {
  vocab?: VocabResponse;
};

export function VocabCard({ vocab }: VocabCardProps) {
  if (!vocab) {
    return <Card subtitle="Vocabulary support is ready for API wiring." />;
  }

  return (
    <Card title={vocab.writing} subtitle={vocab.meaning ?? vocab.reading} />
  );
}

type KanjiCardProps = {
  kanji?: KanjiResponse;
};

export function KanjiCard({ kanji }: KanjiCardProps) {
  if (!kanji) {
    return <Card subtitle="Vocabulary support is ready for API wiring." />;
  }

  return(
    <Card title={kanji.writing} subtitle={kanji.sino ?? kanji.meaning} />
  );
}
