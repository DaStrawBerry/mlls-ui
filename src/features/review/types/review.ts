export type ReviewRating = "AGAIN" | "HARD" | "GOOD" | "EASY";

export type ReviewCellResponse = {
  id: string;
  front: string;
  back: string;
  answers?: ReviewRating[];
};

export type ReviewSource = "cells" | "shelf" | "study-set";

export type ReviewStartTarget = {
  source: ReviewSource;
  id?: string;
  ids?: string[];
  title?: string;
};
