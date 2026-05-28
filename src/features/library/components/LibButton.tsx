import { SearchActionButton } from "@/components/ui/SearchActionButton";
import { useRouter } from "expo-router";
import type { LibMode } from "../types/memory";

type LibraryActionButtonsProps = {
  mode: LibMode;
  selectMode?: boolean;
  selectedCount?: number;
  onToggleSelectMode?: () => void;
};

export function LibraryActionButtons({
  mode,
  selectMode = false,
  selectedCount = 0,
  onToggleSelectMode,
}: LibraryActionButtonsProps) {
  const router = useRouter();

  if (mode === "CELLS") {
    return (
      <SearchActionButton
        action={selectMode ? "cancel" : "select"}
        count={selectedCount}
        onPress={onToggleSelectMode ?? (() => {})}
      />
    );
  }

  return (
    <SearchActionButton
      action="add"
      onPress={() =>
        router.push({
          pathname: "/library/[type]/add",
          params: {
            type: mode,
          },
        })
      }
    />
  );
}
