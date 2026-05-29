import { apiFetch } from "@/api/client";
import type {
  ReviewCellResponse,
  ReviewRating,
} from "@/features/review/types/review";

export function getReviewCellsByIds(cellIds: string[], size: number) {
  return apiFetch<ReviewCellResponse[]>(
    `/api/memory/review/cells?size=${size}`,
    {
      method: "POST",
      body: JSON.stringify(cellIds),
    },
  );
}

export function getReviewShelfCells(shelfId: string, size: number) {
  return apiFetch<ReviewCellResponse[]>(
    `/api/memory/review/shelves/${shelfId}/cells?size=${size}`,
  );
}

export function getReviewStudySetCells(studySetId: string, size: number) {
  return apiFetch<ReviewCellResponse[]>(
    `/api/memory/review/study-sets/${studySetId}/cells?size=${size}`,
  );
}

export function submitReview(cells: Record<string, ReviewRating>) {
  return apiFetch<void>("/api/memory/review/submissions", {
    method: "POST",
    body: JSON.stringify({ cells }),
  });
}
