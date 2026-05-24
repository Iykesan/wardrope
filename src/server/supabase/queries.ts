import type {
  Category,
  Subcategory,
  WardrobeItem,
  Outfit,
  PlanEntry,
} from "@/shared/types";
import { getSupabaseAdmin } from "@/server/supabase/server";

type CategoryRow = {
  id: string;
  name: string;
  display_order: number;
  user_id: string;
};

type SubcategoryRow = {
  id: string;
  category_id: string;
  name: string;
  display_order: number;
  user_id: string;
};

type ItemRow = {
  id: string;
  name: string;
  category_id: string;
  subcategory_id: string;
  color: string | null;
  fit: string | null;
  season: string | null;
  notes: string | null;
  is_favorite: boolean;
  created_at: string;
  user_id: string;
};

type OutfitRow = {
  id: string;
  name: string | null;
  is_favorite: boolean;
  created_at: string;
  user_id: string;
};

type OutfitItemRow = {
  outfit_id: string;
  item_id: string;
  user_id: string;
};

type PlanRow = {
  id: string;
  outfit_id: string;
  planned_date: string;
  description: string | null;
  created_at: string;
  user_id: string;
};

const mapCategory = (row: CategoryRow): Category => ({
  id: row.id,
  name: row.name,
  order: row.display_order ?? 0,
});

const mapSubcategory = (row: SubcategoryRow): Subcategory => ({
  id: row.id,
  categoryId: row.category_id,
  name: row.name,
  order: row.display_order ?? 0,
});

const mapItem = (row: ItemRow): WardrobeItem => ({
  id: row.id,
  name: row.name,
  categoryId: row.category_id,
  subcategoryId: row.subcategory_id,
  color: row.color ?? undefined,
  fit: row.fit ?? undefined,
  season: row.season ?? undefined,
  notes: row.notes ?? undefined,
  isFavorite: row.is_favorite ?? false,
  createdAt: row.created_at,
});

const mapOutfit = (row: OutfitRow, itemIds: string[]): Outfit => ({
  id: row.id,
  name: row.name ?? undefined,
  itemIds,
  isFavorite: row.is_favorite ?? false,
  createdAt: row.created_at,
});

const mapPlan = (row: PlanRow): PlanEntry => ({
  id: row.id,
  outfitId: row.outfit_id,
  plannedDate: row.planned_date,
  description: row.description ?? undefined,
  createdAt: row.created_at,
});

export const fetchBootstrap = async (userId: string) => {
  const supabase = getSupabaseAdmin();
  const [categories, subcategories, items, outfits, outfitItems, plans] =
    await Promise.all([
      supabase.from("categories").select("*").eq("user_id", userId),
      supabase.from("subcategories").select("*").eq("user_id", userId),
      supabase.from("items").select("*").eq("user_id", userId),
      supabase.from("outfits").select("*").eq("user_id", userId),
      supabase.from("outfit_items").select("*").eq("user_id", userId),
      supabase.from("schedule_entries").select("*").eq("user_id", userId),
    ]);

  if (categories.error) throw categories.error;
  if (subcategories.error) throw subcategories.error;
  if (items.error) throw items.error;
  if (outfits.error) throw outfits.error;
  if (outfitItems.error) throw outfitItems.error;
  if (plans.error) throw plans.error;

  const outfitItemsByOutfit = (outfitItems.data as OutfitItemRow[]).reduce(
    (acc, row) => {
      const current = acc.get(row.outfit_id) ?? [];
      current.push(row.item_id);
      acc.set(row.outfit_id, current);
      return acc;
    },
    new Map<string, string[]>(),
  );

  return {
    categories: (categories.data as CategoryRow[]).map(mapCategory),
    subcategories: (subcategories.data as SubcategoryRow[]).map(mapSubcategory),
    items: (items.data as ItemRow[]).map(mapItem),
    outfits: (outfits.data as OutfitRow[]).map((row) =>
      mapOutfit(row, outfitItemsByOutfit.get(row.id) ?? []),
    ),
    plans: (plans.data as PlanRow[]).map(mapPlan),
  };
};

export const insertCategory = async (category: Category, userId: string) => {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("categories").insert({
    id: category.id,
    name: category.name,
    display_order: category.order,
    user_id: userId,
  });
  if (error) throw error;
};

export const updateCategory = async (category: Category, userId: string) => {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("categories")
    .update({
      name: category.name,
      display_order: category.order,
    })
    .eq("id", category.id)
    .eq("user_id", userId);
  if (error) throw error;
};

export const deleteCategory = async (id: string, userId: string) => {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
};

export const insertSubcategory = async (
  subcategory: Subcategory,
  userId: string,
) => {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("subcategories").insert({
    id: subcategory.id,
    category_id: subcategory.categoryId,
    name: subcategory.name,
    display_order: subcategory.order,
    user_id: userId,
  });
  if (error) throw error;
};

export const updateSubcategory = async (
  subcategory: Subcategory,
  userId: string,
) => {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("subcategories")
    .update({
      name: subcategory.name,
      display_order: subcategory.order,
    })
    .eq("id", subcategory.id)
    .eq("user_id", userId);
  if (error) throw error;
};

export const deleteSubcategory = async (id: string, userId: string) => {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("subcategories")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
};

export const insertItem = async (item: WardrobeItem, userId: string) => {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("items").insert({
    id: item.id,
    name: item.name,
    category_id: item.categoryId,
    subcategory_id: item.subcategoryId,
    color: item.color ?? null,
    fit: item.fit ?? null,
    season: item.season ?? null,
    notes: item.notes ?? null,
    is_favorite: item.isFavorite,
    user_id: userId,
  });
  if (error) throw error;
};

export const updateItem = async (item: WardrobeItem, userId: string) => {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("items")
    .update({
      name: item.name,
      category_id: item.categoryId,
      subcategory_id: item.subcategoryId,
      color: item.color ?? null,
      fit: item.fit ?? null,
      season: item.season ?? null,
      notes: item.notes ?? null,
      is_favorite: item.isFavorite,
    })
    .eq("id", item.id)
    .eq("user_id", userId);
  if (error) throw error;
};

export const deleteItem = async (id: string, userId: string) => {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("items")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
};

export const insertOutfit = async (outfit: Outfit, userId: string) => {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("outfits").insert({
    id: outfit.id,
    name: outfit.name ?? null,
    is_favorite: outfit.isFavorite,
    user_id: userId,
  });
  if (error) throw error;
  if (outfit.itemIds.length > 0) {
    const { error: itemsError } = await supabase.from("outfit_items").insert(
      outfit.itemIds.map((itemId) => ({
        outfit_id: outfit.id,
        item_id: itemId,
        user_id: userId,
      })),
    );
    if (itemsError) throw itemsError;
  }
};

export const updateOutfit = async (outfit: Outfit, userId: string) => {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("outfits")
    .update({
      name: outfit.name ?? null,
      is_favorite: outfit.isFavorite,
    })
    .eq("id", outfit.id)
    .eq("user_id", userId);
  if (error) throw error;

  const { error: deleteError } = await supabase
    .from("outfit_items")
    .delete()
    .eq("outfit_id", outfit.id)
    .eq("user_id", userId);
  if (deleteError) throw deleteError;

  if (outfit.itemIds.length > 0) {
    const { error: itemsError } = await supabase.from("outfit_items").insert(
      outfit.itemIds.map((itemId) => ({
        outfit_id: outfit.id,
        item_id: itemId,
        user_id: userId,
      })),
    );
    if (itemsError) throw itemsError;
  }
};

export const deleteOutfit = async (id: string, userId: string) => {
  const supabase = getSupabaseAdmin();
  const { error: itemsError } = await supabase
    .from("outfit_items")
    .delete()
    .eq("outfit_id", id)
    .eq("user_id", userId);
  if (itemsError) throw itemsError;
  const { error: plansError } = await supabase
    .from("schedule_entries")
    .delete()
    .eq("outfit_id", id)
    .eq("user_id", userId);
  if (plansError) throw plansError;
  const { error } = await supabase
    .from("outfits")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
};

export const insertPlan = async (plan: PlanEntry, userId: string) => {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("schedule_entries").insert({
    id: plan.id,
    outfit_id: plan.outfitId,
    planned_date: plan.plannedDate,
    description: plan.description ?? null,
    user_id: userId,
  });
  if (error) throw error;
};

export const updatePlan = async (plan: PlanEntry, userId: string) => {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("schedule_entries")
    .update({
      outfit_id: plan.outfitId,
      planned_date: plan.plannedDate,
      description: plan.description ?? null,
    })
    .eq("id", plan.id)
    .eq("user_id", userId);
  if (error) throw error;
};

export const deletePlan = async (id: string, userId: string) => {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("schedule_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
};
