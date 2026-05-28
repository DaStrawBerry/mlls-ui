import React, { useState } from "react";
import { View } from "react-native";

import { useMultiSelect } from "@/hooks/useMultiSelect";
import {
  CellsDisplayer,
  ShelfDisplayer,
  StudySetDisplayer,
} from "./components/LibraryDisplayer";
import { LibrarySearchHeader } from "./components/LibrarySearch";
import type { CellResponse } from "./types/cell";
import type { LibMode, LibSearchParams } from "./types/memory";

export default function LibraryScreen() {
  const [mode, setMode] = useState<LibMode>("SHELF");
  const [selectMode, setSelectMode] = useState(false);

  const [shelfParams, setShelfParams] = useState<LibSearchParams>();
  const [stsetParams, setStSetParams] = useState<LibSearchParams>();
  const [cellsParams, setCellsParams] = useState<LibSearchParams>();

  const selection = useMultiSelect<CellResponse>();

  function exitSelectMode() {
    selection.clearSelected();
    setSelectMode(false);
  }

  function handleModeChange(nextMode: LibMode) {
    exitSelectMode();
    setMode(nextMode);
  }

  function handleSearch(params: LibSearchParams) {
    exitSelectMode();

    if (mode === "SHELF") {
      setShelfParams(params);
    }

    if (mode === "STSET") {
      setStSetParams(params);
    }

    if (mode === "CELLS") {
      setCellsParams(params);
    }
  }

  function handleToggleSelectMode() {
    setSelectMode((current) => {
      const next = !current;

      if (!next) {
        selection.clearSelected();
      }

      return next;
    });
  }

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      <LibrarySearchHeader
        mode={mode}
        selectMode={selectMode}
        selectedCount={selection.selectedCount}
        onModeChange={handleModeChange}
        onSearch={handleSearch}
        onToggleSelectMode={handleToggleSelectMode}
      />

      {mode === "SHELF" && <ShelfDisplayer params={shelfParams} />}
      {mode === "STSET" && <StudySetDisplayer params={stsetParams} />}
      {mode === "CELLS" && (
        <CellsDisplayer
          params={cellsParams}
          selectMode={selectMode}
          selectedIds={selection.selectedIds}
          onToggleSelect={selection.toggleSelected}
        />
      )}
    </View>
  );
}
