export type BoxRequest = {
  name: string;
  slug: string;
  desc?: string;
};

export type BoxResponse = {
  desc?: string;
  id: string;
  name: string;
  slug: string;
};
