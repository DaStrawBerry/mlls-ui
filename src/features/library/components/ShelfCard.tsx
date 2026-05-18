import React from "react";

import { Card } from "@/components/ui/Card";
import { Shelf } from "@/features/library/types";

type ShelfCardProps = {
  shelf?: Shelf;
};

export function ShelfCard({ shelf }: ShelfCardProps) {
  if (!shelf) {
    return <Card subtitle="Shelves are ready for API wiring." />;
  }

  return <Card title={shelf.name} subtitle={shelf.description} />;
}
