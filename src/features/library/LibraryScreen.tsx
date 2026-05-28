import React, { useState } from "react";
import { View } from "react-native";

import {
  CellsDisplayer,
  ShelfDisplayer,
  StudySetDisplayer,
} from "./components/LibraryDisplayer";
import { LibrarySearchHeader } from "./components/LibrarySearch";
import type { LibMode, LibSearchParams } from "./types/memory";

export default function LibraryScreen() {
  const [mode, setMode] = useState<LibMode>("SHELF");

  const [shelfParams, setShelfParams] = useState<LibSearchParams>();
  const [stsetParams, setStSetParams] = useState<LibSearchParams>();
  const [cellsParams, setCellsParams] = useState<LibSearchParams>();

  function handleSearch(params: LibSearchParams) {
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

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      <LibrarySearchHeader
        mode={mode}
        onModeChange={setMode}
        onSearch={handleSearch}
      />

      {mode === "SHELF" && <ShelfDisplayer params={shelfParams} />}
      {mode === "STSET" && <StudySetDisplayer params={stsetParams} />}
      {mode === "CELLS" && <CellsDisplayer params={cellsParams} />}
    </View>
  );
}
