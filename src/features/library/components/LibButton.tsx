import { SearchActionButton } from "@/components/ui/SearchActionButton";
import { useRouter } from "expo-router";
import { View } from "react-native";
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
      <View className="flex-row gap-2">
        <SearchActionButton
          action="add"
          onPress={() =>
            router.push({
              pathname: "/library/[type]/add",
              params: {
                type: "CELLS",
              },
            })
          }
        />

        <SearchActionButton
          action={selectMode ? "cancel" : "select"}
          count={selectedCount}
          onPress={onToggleSelectMode ?? (() => {})}
        />
      </View>
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
