import React from "react";

import { Card } from "@/components/ui/Card";
import { Vocabulary } from "@/features/dictionary/types";

type VocabularyCardProps = {
  vocabulary?: Vocabulary;
};

export function VocabularyCard({ vocabulary }: VocabularyCardProps) {
  if (!vocabulary) {
    return <Card subtitle="Vocabulary support is ready for API wiring." />;
  }

  return (
    <Card
      title={vocabulary.term}
      subtitle={vocabulary.meaning ?? vocabulary.reading}
    />
  );
}
