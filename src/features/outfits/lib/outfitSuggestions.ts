import { formatItemName, type OutfitTemplate } from "@/features/outfits/templates";
import { normalizeText, sortByOrder } from "@/shared/lib/utils";
import type { Category, Subcategory, WardrobeItem, Outfit } from "@/shared/types";

type AddItem = (
  payload: Omit<WardrobeItem, "id" | "createdAt" | "isFavorite">,
) => Promise<WardrobeItem>;

type AddOutfit = (payload: Omit<Outfit, "id" | "createdAt">) => Promise<void>;

type BuildOutfitParams = {
  template: OutfitTemplate;
  categories: Category[];
  subcategories: Subcategory[];
  items: WardrobeItem[];
  addItem: AddItem;
  addOutfit: AddOutfit;
};

const categoryKeywords: Record<string, string[]> = {
  top: ["top", "tops", "shirt", "tee", "t-shirt", "sweater", "hoodie"],
  bottom: ["bottom", "bottoms", "jean", "pant", "trouser", "short", "skirt"],
  shoe: ["shoe", "shoes", "sneaker", "boot", "footwear", "sandal", "loafer"],
  outerwear: ["outerwear", "jacket", "coat", "blazer", "bomber"],
  accessory: ["accessory", "accessories", "bag", "belt", "hat", "cap", "scarf"],
};

const resolveCategoryId = (categoryKey: string, categories: Category[]) => {
  const keywords = categoryKeywords[categoryKey] ?? [];
  const sorted = sortByOrder(categories);
  const match = sorted.find((category) =>
    keywords.some((keyword) =>
      normalizeText(category.name).includes(normalizeText(keyword)),
    ),
  );
  return match?.id ?? sorted[0]?.id;
};

const resolveSubcategoryId = (
  keywords: string[],
  categoryId: string | undefined,
  subcategories: Subcategory[],
) => {
  if (!categoryId) return undefined;
  const sorted = sortByOrder(subcategories).filter(
    (subcategory) => subcategory.categoryId === categoryId,
  );
  const match = sorted.find((subcategory) =>
    keywords.some((keyword) =>
      normalizeText(subcategory.name).includes(normalizeText(keyword)),
    ),
  );
  return match?.id ?? sorted[0]?.id;
};

const itemKey = (subcategoryId: string, name: string, color?: string) =>
  `${subcategoryId}::${normalizeText(name)}::${normalizeText(color ?? "")}`;

export const buildOutfitFromTemplate = async ({
  template,
  categories,
  subcategories,
  items,
  addItem,
  addOutfit,
}: BuildOutfitParams) => {
  const itemMap = new Map<string, WardrobeItem>();
  items.forEach((item) =>
    itemMap.set(itemKey(item.subcategoryId, item.name, item.color), item),
  );
  const selectedIds: string[] = [];

  for (const itemTemplate of template.itemTemplates) {
    const categoryId = resolveCategoryId(itemTemplate.categoryKey, categories);
    const subcategoryId = resolveSubcategoryId(
      itemTemplate.subcategoryKeywords,
      categoryId,
      subcategories,
    );
    if (!categoryId || !subcategoryId) {
      continue;
    }
    const name = formatItemName(itemTemplate);
    const key = itemKey(subcategoryId, name, itemTemplate.color);
    const existing = itemMap.get(key);
    if (existing) {
      if (!selectedIds.includes(existing.id)) {
        selectedIds.push(existing.id);
      }
      continue;
    }
    const created = await addItem({
      name,
      categoryId,
      subcategoryId,
      visualKey: itemTemplate.visualKey,
      color: itemTemplate.color,
    });
    itemMap.set(key, created);
    if (!selectedIds.includes(created.id)) {
      selectedIds.push(created.id);
    }
  }

  if (selectedIds.length === 0) {
    throw new Error("No matching items could be created for this outfit.");
  }

  await addOutfit({
    name: template.name,
    itemIds: selectedIds,
    isFavorite: false,
  });
};
