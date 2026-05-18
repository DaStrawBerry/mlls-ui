import React from "react";

import { Card } from "@/components/ui/Card";
import { StudySet } from "@/features/library/types";

type StudySetCardProps = {
  studySet?: StudySet;
};

export function StudySetCard({ studySet }: StudySetCardProps) {
  if (!studySet) {
    return <Card subtitle="Study sets are ready for API wiring." />;
  }

  return <Card title={studySet.name} subtitle={studySet.description} />;
}
