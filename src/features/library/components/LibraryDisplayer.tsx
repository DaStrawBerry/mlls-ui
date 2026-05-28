import { InfiniteDisplayer } from "@/components/ui/InfiniteDisplayer";
import { useCellSearch } from "../hooks/useCell";
import { useShelvesSearch } from "../hooks/useShelves";
import { useStudySetSearch } from "../hooks/useStudySets";
import type { LibSearchParams } from "../types/memory";
import { CellCard } from "./cards/CellCard";
import { ShelfCard } from "./cards/ShelfCard";
import { StudySetCard } from "./cards/StudySetCard";

export function ShelfDisplayer({ params }: { params?: LibSearchParams }) {
  const query = useShelvesSearch(20, params);

  return (
    <InfiniteDisplayer
      query={query}
      keyExtractor={(item) => item.id}
      loadingText="Loading shelves..."
      errorTitle="Failed to load shelves."
      errorMessage="Check your phone Wi-Fi connection. Or report to admin."
      renderItem={(item) => <ShelfCard box={item} />}
    />
  );
}

export function StudySetDisplayer({ params }: { params?: LibSearchParams }) {
  const query = useStudySetSearch(20, params);

  return (
    <InfiniteDisplayer
      query={query}
      keyExtractor={(item) => item.id}
      loadingText="Loading study sets..."
      errorTitle="Failed to load study sets."
      errorMessage="Check your phone Wi-Fi connection. Or report to admin."
      renderItem={(item) => <StudySetCard box={item} />}
    />
  );
}

export function CellsDisplayer({ params }: { params?: LibSearchParams }) {
  const query = useCellSearch(20, params);

  return (
    <InfiniteDisplayer
      query={query}
      keyExtractor={(item) => item.id}
      loadingText="Loading cells..."
      errorTitle="Failed to load cells."
      errorMessage="Check your phone Wi-Fi connection. Or report to admin."
      renderItem={(item) => <CellCard cell={item} />}
    />
  );
}
