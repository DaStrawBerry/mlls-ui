import {
  getReviewCellsByIds,
  getReviewShelfCells,
  getReviewStudySetCells,
  submitReview,
} from "@/api/library/review";
import type { ReviewRating, ReviewSource } from "../types/review";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type ReviewCellsInput = {
  source?: ReviewSource;
  id?: string;
  ids?: string[];
  size: number;
};

function canLoadReview(input: ReviewCellsInput) {
  if (!input.source) return false;
  if (!Number.isFinite(input.size) || input.size <= 0) return false;
  if (input.source === "cells") return !!input.ids?.length;
  return !!input.id;
}

export function useReviewCells(input: ReviewCellsInput) {
  return useQuery({
    queryKey: ["review-cells", input.source, input.id, input.ids, input.size],
    enabled: canLoadReview(input),
    queryFn: () => {
      if (input.source === "cells") {
        return getReviewCellsByIds(input.ids ?? [], input.size);
      }

      if (input.source === "shelf") {
        return getReviewShelfCells(input.id ?? "", input.size);
      }

      return getReviewStudySetCells(input.id ?? "", input.size);
    },
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, Record<string, ReviewRating>>({
    mutationFn: (cells) => submitReview(cells),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review-cells"] });
      queryClient.invalidateQueries({ queryKey: ["cells"] });
      queryClient.invalidateQueries({ queryKey: ["cell"] });
      queryClient.invalidateQueries({ queryKey: ["library-box-cells"] });
    },
  });
}
