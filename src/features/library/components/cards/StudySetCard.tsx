import { ErrorInfoCard, InfoCard } from "@/components/ui/InfoCard";
import type { BoxResponse } from "@/features/library/types/box";
import { mapBoxToInfoCardItem } from "./libraryCardMapper";

type BoxCardProps = {
  box?: BoxResponse | null;
};

export function StudySetCard({ box }: BoxCardProps) {
  if (!box) return <ErrorInfoCard />;

  return (
    <InfoCard
      item={mapBoxToInfoCardItem(box)}
      emptyContentText="No description yet"
    />
  );
}
