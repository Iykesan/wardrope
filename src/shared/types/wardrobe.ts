export type Category = {
  id: string;
  name: string;
  order: number;
};

export type Subcategory = {
  id: string;
  categoryId: string;
  name: string;
  order: number;
};

export type WardrobeItem = {
  id: string;
  name: string;
  categoryId: string;
  subcategoryId: string;
  visualKey?: string;
  color?: string;
  fit?: string;
  season?: string;
  notes?: string;
  isFavorite: boolean;
  createdAt: string;
};
