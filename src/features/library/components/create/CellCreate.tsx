import { getErrorMessage, useToast } from "@/components/ui/Toast";
import { useRouter } from "expo-router";
import { useState } from "react";

import { useCreateCells } from "../../hooks/useCell";
import { useAddCellsToStudySet } from "../../hooks/useLibraryBox";
import type { BoxRequest, BoxResponse } from "../../types/box";
import type { CellRequest } from "../../types/cell";
import type { LibGroupMode } from "../../types/memory";
import { BoxPickerModal } from "../BoxPickerModal";
import { CellForm } from "../form/CellForm";

function createEmptyCellForm(): CellRequest {
  return {
    front: "",
    back: "",
    external: "",
    sourceType: "MANUAL",
    sourceId: "",
    metadata: "",
  };
}

function createEmptyBoxForm(): BoxRequest {
  return {
    name: "",
    slug: "",
  };
}

function cleanCellForm(form: CellRequest): CellRequest {
  return {
    front: form.front.trim(),
    back: form.back.trim(),
    external: form.external?.trim(),
    sourceType: form.sourceType?.trim(),
    sourceId: form.sourceId?.trim(),
    metadata: form.metadata?.trim(),
    rating: form.rating,
  };
}

function cleanBoxForm(form: BoxRequest): BoxRequest {
  return {
    name: form.name.trim(),
    slug: form.slug.trim(),
  };
}

function mapBoxToRequest(box: BoxResponse): BoxRequest {
  return {
    name: box.name,
    slug: box.slug,
  };
}

export function CellCreate() {
  const router = useRouter();
  const toast = useToast();
  const createMutation = useCreateCells();
  const addToStudySetMutation = useAddCellsToStudySet();

  const [cell, setCell] = useState<CellRequest>(() => createEmptyCellForm());
  const [box, setBox] = useState<BoxRequest>(() => createEmptyBoxForm());
  const [targetMode, setTargetMode] = useState<LibGroupMode>("SHELF");
  const [selectedTarget, setSelectedTarget] = useState<
    Pick<BoxResponse, "id" | "name" | "slug"> | null
  >(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const submitting = createMutation.isPending || addToStudySetMutation.isPending;

  function handleTargetModeChange(mode: LibGroupMode) {
    setTargetMode(mode);
    setSelectedTarget(null);
  }

  function handleSelectTarget(selectedBox: BoxResponse, mode: LibGroupMode) {
    setTargetMode(mode);
    setSelectedTarget({
      id: selectedBox.id,
      name: selectedBox.name,
      slug: selectedBox.slug,
    });
    setBox(mapBoxToRequest(selectedBox));
    toast.showInfo(
      "Target selected",
      `${selectedBox.name || selectedBox.slug || "Unnamed"} is ready for save.`,
    );
  }

  function goToCreatedCell(firstCellId?: string) {
    if (!firstCellId) return;

    router.replace({
      pathname: "/library/[type]/[id]",
      params: {
        type: "CELLS",
        id: firstCellId,
      },
    });
  }

  function handleCreate() {
    const cleanCell = cleanCellForm(cell);
    const cleanBox = cleanBoxForm(box);

    if (!cleanCell.front || !cleanCell.back) {
      toast.showWarning("Missing cell content", "Front and back are required.");
      return;
    }

    if (!cleanBox.name || !cleanBox.slug) {
      toast.showWarning("Missing box", "Box name and slug are required.");
      return;
    }

    if (targetMode === "STSET" && !selectedTarget) {
      toast.showWarning(
        "Select a study set",
        "Creating into a study set needs a selected study set id.",
      );
      return;
    }

    createMutation.mutate(
      {
        box: cleanBox,
        cells: [cleanCell],
      },
      {
        onSuccess: (created) => {
          const cellIds = created.cells.map((item) => item.id);
          const firstCellId = cellIds[0];

          if (targetMode === "STSET" && selectedTarget) {
            addToStudySetMutation.mutate(
              {
                studySetId: selectedTarget.id,
                cellIds,
              },
              {
                onSuccess: () => {
                  toast.showSuccess(
                    "Created",
                    `Cell created and added to ${selectedTarget.name}.`,
                  );
                  goToCreatedCell(firstCellId);
                },
                onError: (error) => {
                  toast.showError("Add failed", getErrorMessage(error));
                },
              },
            );
            return;
          }

          toast.showSuccess("Created", "Cell created.");
          goToCreatedCell(firstCellId);
        },
        onError: (error) => {
          toast.showError("Create failed", getErrorMessage(error));
        },
      },
    );
  }

  return (
    <>
      <CellForm
        title="Add Cell"
        cell={cell}
        box={box}
        targetMode={targetMode}
        selectedBox={selectedTarget}
        onCellChange={setCell}
        onBoxChange={(nextBox) => {
          setSelectedTarget(null);
          setBox(nextBox);
        }}
        onTargetModeChange={handleTargetModeChange}
        onOpenBoxPicker={() => setPickerOpen(true)}
        onSubmit={handleCreate}
        submitting={submitting}
        submitLabel="Create"
      />

      <BoxPickerModal
        visible={pickerOpen}
        title="Select box for new cell"
        initialMode={targetMode}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelectTarget}
      />
    </>
  );
}
