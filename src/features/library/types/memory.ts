export type LibSearchParams = {
  param?: string;
};

export type LibMode = "SHELF" | "STSET" | "CELLS";

export type LibGroupMode = Exclude<LibMode, "CELLS">;
