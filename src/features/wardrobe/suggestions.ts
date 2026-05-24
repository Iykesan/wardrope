import {
  getVisualKeyForSubcategory,
  type VisualKey,
} from "@/shared/config/visuals";

export type SuggestedItemTemplate = {
  name: string;
  color?: string;
  fit?: string;
  season?: string;
  notes?: string;
  visualKey?: VisualKey;
};

type SuggestionRule = {
  keywords: string[];
  items: SuggestedItemTemplate[];
};

const suggestionRules: SuggestionRule[] = [
  {
    keywords: ["tshirt", "t-shirt", "tee"],
    items: [
      { name: "White T-Shirt", color: "White", visualKey: "top" },
      { name: "Black T-Shirt", color: "Black", visualKey: "top" },
    ],
  },
  {
    keywords: ["shirt", "button", "oxford"],
    items: [
      { name: "White Button-Up", color: "White", visualKey: "top" },
      { name: "Blue Oxford", color: "Blue", visualKey: "top" },
    ],
  },
  {
    keywords: ["sweater", "knit", "crewneck"],
    items: [
      { name: "Cream Knit Sweater", color: "Cream", visualKey: "top" },
      { name: "Charcoal Crewneck", color: "Charcoal", visualKey: "top" },
    ],
  },
  {
    keywords: ["hoodie"],
    items: [
      { name: "Heather Gray Hoodie", color: "Gray", visualKey: "top" },
      { name: "Black Hoodie", color: "Black", visualKey: "top" },
    ],
  },
  {
    keywords: ["jean", "denim"],
    items: [
      { name: "Dark Wash Jeans", color: "Indigo", visualKey: "bottom" },
      { name: "Black Slim Jeans", color: "Black", visualKey: "bottom" },
    ],
  },
  {
    keywords: ["trouser", "slack", "pant"],
    items: [
      { name: "Navy Trousers", color: "Navy", visualKey: "bottom" },
      { name: "Khaki Trousers", color: "Khaki", visualKey: "bottom" },
    ],
  },
  {
    keywords: ["short"],
    items: [
      { name: "Black Chino Shorts", color: "Black", visualKey: "bottom" },
      { name: "Stone Linen Shorts", color: "Stone", visualKey: "bottom" },
    ],
  },
  {
    keywords: ["skirt"],
    items: [
      { name: "Black Midi Skirt", color: "Black", visualKey: "bottom" },
      { name: "Denim Mini Skirt", color: "Denim", visualKey: "bottom" },
    ],
  },
  {
    keywords: ["sneaker", "trainer"],
    items: [
      { name: "White Sneakers", color: "White", visualKey: "shoe" },
      { name: "Black Sneakers", color: "Black", visualKey: "shoe" },
    ],
  },
  {
    keywords: ["boot"],
    items: [
      { name: "Brown Leather Boots", color: "Brown", visualKey: "shoe" },
      { name: "Black Chelsea Boots", color: "Black", visualKey: "shoe" },
    ],
  },
  {
    keywords: ["flat", "ballet"],
    items: [
      { name: "Black Flats", color: "Black", visualKey: "shoe" },
      { name: "Nude Flats", color: "Nude", visualKey: "shoe" },
    ],
  },
  {
    keywords: ["sandal", "slide"],
    items: [
      { name: "Tan Sandals", color: "Tan", visualKey: "shoe" },
      { name: "Black Sandals", color: "Black", visualKey: "shoe" },
    ],
  },
  {
    keywords: ["jacket"],
    items: [
      { name: "Denim Jacket", color: "Denim", visualKey: "outerwear" },
      { name: "Olive Field Jacket", color: "Olive", visualKey: "outerwear" },
    ],
  },
  {
    keywords: ["coat"],
    items: [
      { name: "Camel Coat", color: "Camel", visualKey: "outerwear" },
      { name: "Black Wool Coat", color: "Black", visualKey: "outerwear" },
    ],
  },
  {
    keywords: ["blazer"],
    items: [
      { name: "Navy Blazer", color: "Navy", visualKey: "outerwear" },
      { name: "Black Blazer", color: "Black", visualKey: "outerwear" },
    ],
  },
  {
    keywords: ["hat", "cap", "beanie"],
    items: [
      { name: "Black Cap", color: "Black", visualKey: "accessory" },
      { name: "Neutral Beanie", color: "Neutral", visualKey: "accessory" },
    ],
  },
  {
    keywords: ["bag", "tote", "crossbody"],
    items: [
      { name: "Black Tote Bag", color: "Black", visualKey: "accessory" },
      { name: "Crossbody Bag", color: "Neutral", visualKey: "accessory" },
    ],
  },
  {
    keywords: ["belt"],
    items: [
      { name: "Black Leather Belt", color: "Black", visualKey: "accessory" },
      { name: "Brown Leather Belt", color: "Brown", visualKey: "accessory" },
    ],
  },
  {
    keywords: ["jewel", "ring", "necklace", "bracelet", "earring"],
    items: [
      { name: "Gold Chain", color: "Gold", visualKey: "accessory" },
      { name: "Silver Studs", color: "Silver", visualKey: "accessory" },
    ],
  },
];

const normalizeKey = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

export const getSuggestionsForSubcategory = (subcategoryName?: string) => {
  if (!subcategoryName) return [];
  const key = normalizeKey(subcategoryName);
  if (!key) return [];
  const rule = suggestionRules.find((suggestion) =>
    suggestion.keywords.some((keyword) => key.includes(normalizeKey(keyword))),
  );
  if (rule) return rule.items;
  const fallbackKey = getVisualKeyForSubcategory(subcategoryName);
  return [
    { name: `White ${subcategoryName}`, color: "White", visualKey: fallbackKey },
    { name: `Black ${subcategoryName}`, color: "Black", visualKey: fallbackKey },
  ];
};
