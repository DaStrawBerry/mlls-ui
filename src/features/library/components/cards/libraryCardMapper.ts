import type { InfoCardBaseItem } from "@/components/ui/InfoCard";
import type { BoxResponse } from "@/features/library/types/box";
import type { CellResponse } from "@/features/library/types/cell";

export function mapBoxToInfoCardItem(box: BoxResponse): InfoCardBaseItem {
  return {
    title: box.name,
    subtitle: box.slug,
    content: box.desc,
  };
}

export function mapCellToInfoCardItem(cell: CellResponse): InfoCardBaseItem {
  return {
    title: cell.front,
    content: cell.back,
  };
}
