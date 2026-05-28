export type ReviewRating = "AGAIN" | "HARD" | "GOOD" | "EASY";

export type CellRequest = {
  external?: string;
  sourceType?: string;
  sourceId?: string;
  front: string;
  back: string;
  metadata?: string;
  rating?: ReviewRating;
};

export type CellResponse = {
  id: string;
  front: string;
  back: string;
};

export type CellBoxRequest = {
  box: {
    name: string;
    slug: string;
    desc?: string;
  };
  cells: CellRequest[];
};

export type CellBoxResponse = {
  box: {
    id: string;
    name: string;
    slug: string;
    desc?: string;
  };
  cells: CellResponse[];
};
