import { SearchActionButton } from "@/components/ui/SearchActionButton";
import { getErrorMessage, useToast } from "@/components/ui/Toast";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { confirmAction } from "@/utils/confirmAction";
import { useRouter } from "expo-router";

import {
  useAddCellsToStudySet,
  useMoveCellsToShelf,
  useRemoveCellsFromStudySet,
} from "../hooks/useLibraryBox";
import { useDeleteCells } from "../hooks/useCell";
import type { BoxResponse } from "../types/box";
import type { LibGroupMode } from "../types/memory";
import { BoxPickerModal } from "./BoxPickerModal";
import { ReviewStartModal } from "@/features/review/components/ReviewStartModal";
import type { ReviewStartTarget } from "@/features/review/types/review";

type RemoveMode = "none" | "delete-cells" | "remove-from-study-set";

type SelectedTarget = {
  id: string;
  name: string;
  slug?: string;
  mode: LibGroupMode;
};

type SelectedCellActionsProps = {
  selectedIds: readonly string[];
  onDone: () => void;
  currentBoxId?: string;
  removeMode?: RemoveMode;
};

function getTargetLabel(mode: LibGroupMode) {
  if (mode === "SHELF") return "shelf";
  return "study set";
}

export function SelectedCellActions({
  selectedIds,
  onDone,
  currentBoxId,
  removeMode = "none",
}: SelectedCellActionsProps) {
  const router = useRouter();
  const toast = useToast();
  const [pickerMode, setPickerMode] = useState<LibGroupMode | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<SelectedTarget | null>(
    null,
  );
  const [reviewTarget, setReviewTarget] = useState<ReviewStartTarget | null>(
    null,
  );

  const moveMutation = useMoveCellsToShelf();
  const addToStudySetMutation = useAddCellsToStudySet();
  const removeFromStudySetMutation = useRemoveCellsFromStudySet();
  const deleteCellsMutation = useDeleteCells();

  const selectedCount = selectedIds.length;
  const hasSelection = selectedCount > 0;
  const busy =
    moveMutation.isPending ||
    addToStudySetMutation.isPending ||
    removeFromStudySetMutation.isPending ||
    deleteCellsMutation.isPending;


  function handleOpenReview() {
    if (!hasSelection) {
      toast.showWarning("No cells selected", "Select at least one cell first.");
      return;
    }

    setReviewTarget({
      source: "cells",
      ids: [...selectedIds],
      title: `${selectedCount} selected cell${selectedCount === 1 ? "" : "s"}`,
    });
  }

  function handleConfirmReview(size: number, target: ReviewStartTarget) {
    setReviewTarget(null);

    router.push({
      pathname: "/review",
      params: {
        source: target.source,
        ids: target.ids?.join(",") ?? "",
        size: String(size),
        title: target.title ?? "Selected cells",
      },
    });
  }

  function handleTargetSelect(target: BoxResponse, mode: LibGroupMode) {
    setSelectedTarget({
      id: target.id,
      name: target.name,
      slug: target.slug,
      mode,
    });
    toast.showInfo(
      "Target selected",
      `${target.name || target.slug || "Unnamed"} is ready. Press confirm to finish.`,
    );
  }

  function handleApplyTarget() {
    if (!hasSelection) {
      toast.showWarning("No cells selected", "Select at least one cell first.");
      return;
    }

    if (!selectedTarget) {
      toast.showWarning("No target selected", "Pick a shelf or study set first.");
      return;
    }

    if (selectedTarget.mode === "SHELF") {
      moveMutation.mutate(
        {
          shelfId: selectedTarget.id,
          cellIds: [...selectedIds],
        },
        {
          onSuccess: () => {
            toast.showSuccess(
              "Move completed",
              `${selectedCount} cell${selectedCount === 1 ? "" : "s"} moved to ${selectedTarget.name}.`,
            );
            onDone();
          },
          onError: (error) => {
            toast.showError("Move failed", getErrorMessage(error));
          },
        },
      );
      return;
    }

    addToStudySetMutation.mutate(
      {
        studySetId: selectedTarget.id,
        cellIds: [...selectedIds],
      },
      {
        onSuccess: () => {
          toast.showSuccess(
            "Added to study set",
            `${selectedCount} cell${selectedCount === 1 ? "" : "s"} added to ${selectedTarget.name}.`,
          );
          onDone();
        },
        onError: (error) => {
          toast.showError("Add failed", getErrorMessage(error));
        },
      },
    );
  }

  function handleRemove() {
    if (!hasSelection) {
      toast.showWarning("No cells selected", "Select at least one cell first.");
      return;
    }

    if (removeMode === "remove-from-study-set") {
      if (!currentBoxId) {
        toast.showWarning(
          "Cannot remove",
          "Current study set id is missing or undefined.",
        );
        return;
      }

      confirmAction({
        title: "Remove from study set?",
        message: `Remove ${selectedCount} selected cell from this study set?`,
        confirmText: "Remove",
        destructive: true,
        onConfirm: () => {
          removeFromStudySetMutation.mutate(
            {
              studySetId: currentBoxId,
              cellIds: [...selectedIds],
            },
            {
              onSuccess: () => {
                toast.showSuccess(
                  "Removed",
                  `${selectedCount} cell${selectedCount === 1 ? "" : "s"} removed from study set.`,
                );
                onDone();
              },
              onError: (error) => {
                toast.showError("Remove failed", getErrorMessage(error));
              },
            },
          );
        },
      });
      return;
    }

    if (removeMode === "delete-cells") {
      confirmAction({
        title: "Remove selected cells?",
        message: "This uses the cell delete/remove endpoint. Continue?",
        confirmText: "Remove",
        destructive: true,
        onConfirm: () => {
          deleteCellsMutation.mutate([...selectedIds], {
            onSuccess: () => {
              toast.showSuccess(
                "Removed",
                `${selectedCount} cell${selectedCount === 1 ? "" : "s"} removed.`,
              );
              onDone();
            },
            onError: (error) => {
              toast.showError("Remove failed", getErrorMessage(error));
            },
          });
        },
      });
      return;
    }

    toast.showWarning("No remove action", "This screen has no remove action.");
  }

  return (
    <View className="rounded-2xl border border-blue-100 bg-blue-50 p-3">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="font-semibold text-blue-900">
          {selectedCount} selected
        </Text>
        <Text className="text-xs text-blue-700">
          Pick a target, then press confirm.
        </Text>
      </View>

      <View className="flex-row flex-wrap justify-end gap-2">
        <SearchActionButton
          action="review"
          count={selectedCount}
          disabled={!hasSelection || busy}
          onPress={handleOpenReview}
        />

        <SearchActionButton
          action="move"
          count={selectedCount}
          disabled={!hasSelection || busy}
          onPress={() => setPickerMode("SHELF")}
        />

        <SearchActionButton
          action="add"
          count={selectedCount}
          disabled={!hasSelection || busy}
          onPress={() => setPickerMode("STSET")}
        />

        {removeMode !== "none" ? (
          <SearchActionButton
            action="remove"
            count={selectedCount}
            disabled={!hasSelection || busy}
            onPress={handleRemove}
          />
        ) : null}
      </View>

      {selectedTarget ? (
        <View className="mt-3 rounded-2xl border border-blue-200 bg-white p-3">
          <Text className="text-xs font-bold uppercase text-blue-500">
            Selected {getTargetLabel(selectedTarget.mode)}
          </Text>
          <Text className="mt-1 text-lg font-bold text-blue-950">
            {selectedTarget.name || "Unnamed"}
          </Text>
          {selectedTarget.slug ? (
            <Text className="mt-1 text-sm font-semibold text-blue-700">
              {selectedTarget.slug}
            </Text>
          ) : null}

          <View className="mt-3 flex-row justify-end gap-2">
            <Pressable
              onPress={() => setSelectedTarget(null)}
              disabled={busy}
              className="rounded-xl bg-gray-100 px-4 py-3 disabled:opacity-50"
            >
              <Text className="font-semibold text-gray-700">Clear</Text>
            </Pressable>

            <Pressable
              onPress={handleApplyTarget}
              disabled={!hasSelection || busy}
              className="rounded-xl bg-blue-600 px-4 py-3 disabled:opacity-50"
            >
              <Text className="font-bold text-white">
                {busy
                  ? "Saving..."
                  : selectedTarget.mode === "SHELF"
                    ? "Move selected"
                    : "Add selected"}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <BoxPickerModal
        visible={!!pickerMode}
        title={pickerMode === "SHELF" ? "Move to shelf" : "Add to study set"}
        initialMode={pickerMode ?? "SHELF"}
        onClose={() => setPickerMode(null)}
        onSelect={handleTargetSelect}
      />

      <ReviewStartModal
        visible={!!reviewTarget}
        target={reviewTarget}
        onClose={() => setReviewTarget(null)}
        onConfirm={handleConfirmReview}
      />
    </View>
  );
}



