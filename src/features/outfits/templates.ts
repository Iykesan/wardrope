import type { VisualKey } from "@/shared/config/visuals";
import { normalizeText } from "@/shared/lib/utils";

export type CategoryKey = "top" | "bottom" | "shoe" | "outerwear" | "accessory";

export type BaseItemTemplate = {
  name: string;
  color?: string;
  categoryKey: CategoryKey;
  subcategoryKeywords: string[];
  visualKey: VisualKey;
};

export type OutfitTemplate = {
  name: string;
  itemTemplates: BaseItemTemplate[];
};

const expandTemplate = (config: {
  name: string;
  colors: string[];
  categoryKey: CategoryKey;
  subcategoryKeywords: string[];
  visualKey: VisualKey;
}) =>
  config.colors.map((color) => ({
    name: config.name,
    color,
    categoryKey: config.categoryKey,
    subcategoryKeywords: config.subcategoryKeywords,
    visualKey: config.visualKey,
  }));

export const formatItemName = (template: BaseItemTemplate) => {
  const trimmedName = template.name.trim();
  if (!template.color) return trimmedName;
  const normalizedName = normalizeText(trimmedName);
  const normalizedColor = normalizeText(template.color);
  if (normalizedName.startsWith(normalizedColor)) {
    return trimmedName;
  }
  return `${template.color} ${trimmedName}`;
};

const buildOutfitName = (items: BaseItemTemplate[]) => {
  if (items.length === 0) return "Everyday Outfit";
  const [top, bottom, shoe, outerwear, accessory] = items;
  let name = `${formatItemName(top)} + ${formatItemName(bottom)}`;
  if (shoe) {
    name += ` + ${formatItemName(shoe)}`;
  }
  if (outerwear) {
    name += ` + ${formatItemName(outerwear)}`;
  }
  if (accessory) {
    name += ` + ${formatItemName(accessory)}`;
  }
  return name;
};

export const generateOutfitTemplates = (maxCount = 240): OutfitTemplate[] => {
  const tops = [
    ...expandTemplate({
      name: "T-Shirt",
      colors: ["White", "Black", "Navy", "Gray", "Olive"],
      categoryKey: "top",
      subcategoryKeywords: ["t-shirt", "tee", "tshirt"],
      visualKey: "top",
    }),
    ...expandTemplate({
      name: "Button-Up",
      colors: ["White", "Light Blue", "Navy", "Stripe"],
      categoryKey: "top",
      subcategoryKeywords: ["shirt", "button", "oxford"],
      visualKey: "top",
    }),
    ...expandTemplate({
      name: "Sweater",
      colors: ["Cream", "Charcoal", "Camel"],
      categoryKey: "top",
      subcategoryKeywords: ["sweater", "knit", "crewneck"],
      visualKey: "top",
    }),
    ...expandTemplate({
      name: "Hoodie",
      colors: ["Heather Gray", "Black"],
      categoryKey: "top",
      subcategoryKeywords: ["hoodie"],
      visualKey: "top",
    }),
    ...expandTemplate({
      name: "Tank Top",
      colors: ["White", "Black"],
      categoryKey: "top",
      subcategoryKeywords: ["tank"],
      visualKey: "top",
    }),
  ];

  const bottoms = [
    ...expandTemplate({
      name: "Jeans",
      colors: ["Dark Wash", "Black", "Light Wash"],
      categoryKey: "bottom",
      subcategoryKeywords: ["jean", "denim"],
      visualKey: "bottom",
    }),
    ...expandTemplate({
      name: "Chinos",
      colors: ["Khaki", "Navy", "Olive"],
      categoryKey: "bottom",
      subcategoryKeywords: ["chino", "trouser", "pant"],
      visualKey: "bottom",
    }),
    ...expandTemplate({
      name: "Shorts",
      colors: ["Black", "Stone", "Navy"],
      categoryKey: "bottom",
      subcategoryKeywords: ["short"],
      visualKey: "bottom",
    }),
    ...expandTemplate({
      name: "Skirt",
      colors: ["Black", "Denim"],
      categoryKey: "bottom",
      subcategoryKeywords: ["skirt"],
      visualKey: "bottom",
    }),
  ];

  const shoes = [
    ...expandTemplate({
      name: "Sneakers",
      colors: ["White", "Black"],
      categoryKey: "shoe",
      subcategoryKeywords: ["sneaker", "trainer"],
      visualKey: "shoe",
    }),
    ...expandTemplate({
      name: "Boots",
      colors: ["Brown", "Black"],
      categoryKey: "shoe",
      subcategoryKeywords: ["boot"],
      visualKey: "shoe",
    }),
    ...expandTemplate({
      name: "Loafers",
      colors: ["Black", "Tan"],
      categoryKey: "shoe",
      subcategoryKeywords: ["loafer"],
      visualKey: "shoe",
    }),
    ...expandTemplate({
      name: "Sandals",
      colors: ["Tan", "Black"],
      categoryKey: "shoe",
      subcategoryKeywords: ["sandal", "slide"],
      visualKey: "shoe",
    }),
  ];

  const outerwears = [
    ...expandTemplate({
      name: "Denim Jacket",
      colors: ["Denim", "Black"],
      categoryKey: "outerwear",
      subcategoryKeywords: ["jacket", "denim"],
      visualKey: "outerwear",
    }),
    ...expandTemplate({
      name: "Blazer",
      colors: ["Navy", "Black"],
      categoryKey: "outerwear",
      subcategoryKeywords: ["blazer"],
      visualKey: "outerwear",
    }),
    ...expandTemplate({
      name: "Coat",
      colors: ["Camel", "Black"],
      categoryKey: "outerwear",
      subcategoryKeywords: ["coat"],
      visualKey: "outerwear",
    }),
    ...expandTemplate({
      name: "Bomber Jacket",
      colors: ["Olive", "Black"],
      categoryKey: "outerwear",
      subcategoryKeywords: ["bomber", "jacket"],
      visualKey: "outerwear",
    }),
  ];

  const accessories = [
    ...expandTemplate({
      name: "Belt",
      colors: ["Black", "Brown"],
      categoryKey: "accessory",
      subcategoryKeywords: ["belt"],
      visualKey: "accessory",
    }),
    ...expandTemplate({
      name: "Cap",
      colors: ["Black", "Neutral"],
      categoryKey: "accessory",
      subcategoryKeywords: ["hat", "cap"],
      visualKey: "accessory",
    }),
    ...expandTemplate({
      name: "Tote Bag",
      colors: ["Black", "Tan"],
      categoryKey: "accessory",
      subcategoryKeywords: ["bag", "tote"],
      visualKey: "accessory",
    }),
    ...expandTemplate({
      name: "Scarf",
      colors: ["Gray", "Camel"],
      categoryKey: "accessory",
      subcategoryKeywords: ["scarf"],
      visualKey: "accessory",
    }),
  ];

  const templates: OutfitTemplate[] = [];
  let index = 0;
  for (const top of tops) {
    for (const bottom of bottoms) {
      for (const shoe of shoes) {
        const items: BaseItemTemplate[] = [top, bottom, shoe];
        if (outerwears.length > 0 && index % 2 === 0) {
          items.push(outerwears[index % outerwears.length]);
        }
        if (accessories.length > 0 && index % 3 === 0) {
          items.push(accessories[index % accessories.length]);
        }
        templates.push({
          name: buildOutfitName(items),
          itemTemplates: items,
        });
        if (templates.length >= maxCount) {
          return templates;
        }
        index += 1;
      }
    }
  }
  return templates;
};
