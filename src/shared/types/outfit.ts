export type Outfit = {
  id: string;
  name?: string;
  itemIds: string[];
  isFavorite: boolean;
  createdAt: string;
};

export type PlanEntry = {
  id: string;
  outfitId: string;
  plannedDate: string;
  description?: string;
  createdAt: string;
};
