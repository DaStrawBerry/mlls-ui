import React from "react";

import { Card } from "@/components/ui/Card";
import { MemoryCell } from "@/features/library/types";

type MemoryCellCardProps = {
  memoryCell?: MemoryCell;
};

export function MemoryCellCard({ memoryCell }: MemoryCellCardProps) {
  if (!memoryCell) {
    return <Card subtitle="Memory cells are ready for review flows." />;
  }

  return <Card title={memoryCell.prompt} subtitle={memoryCell.answer} />;
}
