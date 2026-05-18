export type Shelf = {
  id: string;
  name: string;
  description?: string;
};

export type StudySet = {
  id: string;
  name: string;
  description?: string;
  shelfId?: string;
};

export type MemoryCell = {
  id: string;
  prompt: string;
  answer?: string;
  studySetId?: string;
};
