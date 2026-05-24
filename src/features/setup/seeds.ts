export type CategorySeed = {
  name: string;
  subcategories: string[];
};

export const defaultCategorySeeds: CategorySeed[] = [
  {
    name: "Tops",
    subcategories: ["T-Shirts", "Shirts", "Sweaters", "Hoodies"],
  },
  {
    name: "Bottoms",
    subcategories: ["Jeans", "Trousers", "Shorts", "Skirts"],
  },
  {
    name: "Shoes",
    subcategories: ["Sneakers", "Boots", "Flats", "Sandals"],
  },
  {
    name: "Outerwear",
    subcategories: ["Jackets", "Coats", "Blazers"],
  },
  {
    name: "Accessories",
    subcategories: ["Hats", "Bags", "Belts", "Jewelry"],
  },
];
