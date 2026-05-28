import { InfiniteDisplayer } from "@/components/ui/InfiniteDisplayer";
import { Link } from "expo-router";
import type { ReactElement } from "react";
import { Pressable } from "react-native";

import { useCellSearch } from "../hooks/useCell";
import { useShelvesSearch } from "../hooks/useShelves";
import { useStudySetSearch } from "../hooks/useStudySets";
import type { BoxResponse } from "../types/box";
import type { CellResponse } from "../types/cell";
import type { LibGroupMode, LibSearchParams } from "../types/memory";
import { CellCard } from "./cards/CellCard";
import { ShelfCard } from "./cards/ShelfCard";
import { StudySetCard } from "./cards/StudySetCard";

function BoxItemLink({
  type,
  item,
  children,
}: {
  type: LibGroupMode;
  item: BoxResponse;
  children: ReactElement;
}) {
  return (
    <Link
      href={{
        pathname: "/library/[type]/[id]",
        params: {
          type,
          id: item.id,
          name: item.name,
          slug: item.slug,
          desc: item.desc ?? "",
        },
      }}
      asChild
    >
      <Pressable>{children}</Pressable>
    </Link>
  );
}

function CellItemLink({
  item,
  children,
}: {
  item: CellResponse;
  children: ReactElement;
}) {
  return (
    <Link
      href={{
        pathname: "/library/[type]/[id]",
        params: {
          type: "CELLS",
          id: item.id,
        },
      }}
      asChild
    >
      <Pressable>{children}</Pressable>
    </Link>
  );
}

export function ShelfDisplayer({ params }: { params?: LibSearchParams }) {
  const query = useShelvesSearch(20, params);

  return (
    <InfiniteDisplayer
      query={query}
      keyExtractor={(item) => item.id}
      loadingText="Loading shelves..."
      errorTitle="Failed to load shelves."
      errorMessage="Check your phone Wi-Fi connection. Or report to admin."
      renderItem={(item) => (
        <BoxItemLink type="SHELF" item={item}>
          <ShelfCard box={item} />
        </BoxItemLink>
      )}
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
      renderItem={(item) => (
        <BoxItemLink type="STSET" item={item}>
          <StudySetCard box={item} />
        </BoxItemLink>
      )}
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
      renderItem={(item) => (
        <CellItemLink item={item}>
          <CellCard cell={item} />
        </CellItemLink>
      )}
    />
  );
}
