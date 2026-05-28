import { ErrorInfoCard, InfoCard } from "@/components/ui/InfoCard";
import { CellResponse } from "../../types/cell";
import { mapCellToInfoCardItem } from "./libraryCardMapper";

type CellCardProps = {
  cell?: CellResponse | null;
};

export function CellCard({ cell }: CellCardProps) {
  if (!cell) return <ErrorInfoCard />;

  return (
    <InfoCard
      item={mapCellToInfoCardItem(cell)}
      emptyContentText="No description yet"
    />
  );
}
