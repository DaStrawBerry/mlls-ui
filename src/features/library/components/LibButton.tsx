import { LibMode } from "../types/memory";

type LibraryActionButtonsProps = {
  mode: LibMode;
};

export function LibraryActionButtons({ mode }: LibraryActionButtonsProps) {
  if (mode === "SHELF") {
    return null; // sau này AddShelfButton
  }

  if (mode === "STSET") {
    return null; // sau này AddStudySetButton
  }

  if (mode === "CELLS") {
    return null; // sau này AddCellButton
  }

  return null;
}
