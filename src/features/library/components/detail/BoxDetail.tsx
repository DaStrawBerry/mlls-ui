import { InfiniteDisplayer } from "@/components/ui/InfiniteDisplayer";
import { SearchActionButton } from "@/components/ui/SearchActionButton";
import { getErrorMessage, useToast } from "@/components/ui/Toast";
import { useMultiSelect } from "@/hooks/useMultiSelect";
import { confirmAction } from "@/utils/confirmAction";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { SelectedCellActions } from "@/features/library/components/SelectedCellActions";
import {
  useDeleteLibraryBox,
  useLibraryBoxCells,
} from "../../hooks/useLibraryBox";
import type { BoxResponse } from "../../types/box";
import type { CellResponse } from "../../types/cell";
import type { LibGroupMode } from "../../types/memory";
import { CellCard } from "../cards/CellCard";

type BoxDetailProps = {
  type: LibGroupMode;
  box: BoxResponse;
};

function getTypeLabel(type: LibGroupMode) {
  if (type === "SHELF") return "Shelf";
  return "Study Set";
}

function getRemoveMode(type: LibGroupMode) {
  if (type === "STSET") return "remove-from-study-set";
  return "delete-cells";
}

export function BoxDetail({ type, box }: BoxDetailProps) {
  const router = useRouter();
  const toast = useToast();
  const query = useLibraryBoxCells(type, box.id, 20);
  const deleteMutation = useDeleteLibraryBox(type);
  const selection = useMultiSelect<CellResponse>();
  const [selectMode, setSelectMode] = useState(false);

  function exitSelectMode() {
    selection.clearSelected();
    setSelectMode(false);
  }

  function toggleSelectMode() {
    setSelectMode((current) => {
      const next = !current;

      if (!next) {
        selection.clearSelected();
      }

      return next;
    });
  }

  function handleDeleteBox() {
    confirmAction({
      title: `Delete ${getTypeLabel(type)}?`,
      message:
        type === "SHELF"
          ? "Shelf can only be deleted if it is empty. If it is not empty, the API will return a warning."
          : "This will delete the study set. The cells themselves are kept.",
      confirmText: "Delete",
      destructive: true,
      onConfirm: () => {
        deleteMutation.mutate(box.id, {
          onSuccess: () => {
            toast.showSuccess("Deleted", `${getTypeLabel(type)} deleted.`);
            router.replace("/library");
          },
          onError: (error) => {
            toast.showError("Delete failed", getErrorMessage(error));
          },
        });
      },
    });
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-gray-50 px-4">
        <View className="py-4">
          <View className="rounded-2xl bg-white p-6">
            <View className="mb-3 flex-row justify-end gap-2">
              <SearchActionButton
                action={selectMode ? "cancel" : "select"}
                count={selection.selectedCount}
                onPress={toggleSelectMode}
              />

              <SearchActionButton
                action="remove"
                disabled={deleteMutation.isPending}
                onPress={handleDeleteBox}
              />
            </View>

            {box.slug ? (
              <Text className="text-center text-sm font-semibold text-gray-400">
                {getTypeLabel(type)}
                {"::"}
                {box.slug}
              </Text>
            ) : null}
            <Text className="mt-2 text-center text-3xl font-bold text-gray-900">
              {box.name}
            </Text>

            {box.desc ? (
              <Text className="mt-4 text-center text-base text-gray-700">
                {box.desc}
              </Text>
            ) : null}
          </View>

          {selectMode ? (
            <View className="mt-3">
              <SelectedCellActions
                selectedIds={selection.selectedIds}
                currentBoxId={box.id}
                removeMode={getRemoveMode(type)}
                onDone={exitSelectMode}
              />
            </View>
          ) : null}

          <Text className="m-3 text-lg font-bold text-gray-900">Cells</Text>
        </View>
      </View>

      <View className="flex-1 px-4">
        <InfiniteDisplayer
          query={query}
          keyExtractor={(item) => item.id}
          loadingText="Loading cells..."
          emptyText="No cells in this group yet."
          errorTitle="Failed to load cells."
          errorMessage="Check API URL, backend server, and phone Wi-Fi connection."
          selectMode={selectMode}
          selectedIds={selection.selectedIds}
          onToggleSelect={selection.toggleSelected}
          renderItem={(item, meta) => {
            const card = <CellCard cell={item} />;

            if (meta.selectMode) return card;

            return (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/library/[type]/[id]",
                    params: {
                      type: "CELLS",
                      id: item.id,
                    },
                  })
                }
              >
                {card}
              </Pressable>
            );
          }}
        />
      </View>
    </View>
  );
}

