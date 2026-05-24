"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DATA_MODE } from "@/shared/config/constants";
import { defaultCategorySeeds } from "@/features/setup/seeds";
import { api } from "@/features/wardrobe/api/client";
import { getOrCreateUserId } from "@/features/wardrobe/api/user";
import { createId, normalizeText, sortByOrder } from "@/shared/lib/utils";
import type {
  Category,
  Subcategory,
  WardrobeItem,
  Outfit,
  PlanEntry,
} from "@/shared/types";

type DataMode = "local" | "supabase";

type WardrobeState = {
  dataMode: DataMode;
  hasBootstrapped: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  error?: string;
  categories: Category[];
  subcategories: Subcategory[];
  items: WardrobeItem[];
  outfits: Outfit[];
  plans: PlanEntry[];
  setupComplete: boolean;
  setHydrated: () => void;
  setError: (message?: string) => void;
  initialize: () => Promise<void>;
  completeSetup: (
    categories: Category[],
    subcategories: Subcategory[],
  ) => Promise<void>;
  seedDefaults: () => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  updateCategory: (id: string, name: string) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  addSubcategory: (categoryId: string, name: string) => Promise<void>;
  updateSubcategory: (id: string, name: string) => Promise<void>;
      removeSubcategory: (id: string) => Promise<void>;
      addItem: (
        payload: Omit<WardrobeItem, "id" | "createdAt" | "isFavorite">,
      ) => Promise<WardrobeItem>;
  updateItem: (payload: WardrobeItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  toggleItemFavorite: (id: string) => void;
  addOutfit: (payload: Omit<Outfit, "id" | "createdAt">) => Promise<void>;
  updateOutfit: (payload: Outfit) => Promise<void>;
  removeOutfit: (id: string) => Promise<void>;
  toggleOutfitFavorite: (id: string) => void;
  addPlan: (payload: Omit<PlanEntry, "id" | "createdAt">) => Promise<void>;
  updatePlan: (payload: PlanEntry) => Promise<void>;
  removePlan: (id: string) => Promise<void>;
};

const toISO = () => new Date().toISOString();

const findDefaultSubcategory = (
  subcategories: Subcategory[],
  categoryId: string,
) => {
  const filtered = subcategories
    .filter((subcategory) => subcategory.categoryId === categoryId)
    .sort((a, b) => a.order - b.order);
  return filtered[0];
};

export const useWardrobeStore = create<WardrobeState>()(
  persist(
    (set, get) => ({
      dataMode: DATA_MODE as DataMode,
      hasBootstrapped: false,
      isHydrated: false,
      isLoading: false,
      categories: [],
      subcategories: [],
      items: [],
      outfits: [],
      plans: [],
      setupComplete: false,
      setHydrated: () => set({ isHydrated: true }),
      setError: (message) => set({ error: message }),
      initialize: async () => {
        if (get().dataMode !== "supabase" || get().hasBootstrapped) {
          return;
        }
        const userId = getOrCreateUserId();
        set({ isLoading: true, error: undefined });
        try {
          const data = await api.bootstrap(userId);
          set({
            categories: data.categories,
            subcategories: data.subcategories,
            items: data.items,
            outfits: data.outfits,
            plans: data.plans,
            setupComplete: data.categories.length > 0,
            hasBootstrapped: true,
            isLoading: false,
          });
        } catch (err) {
          set({
            error:
              err instanceof Error
                ? err.message
                : "Supabase is unreachable. Using local data.",
            isLoading: false,
            hasBootstrapped: true,
          });
        }
      },
      completeSetup: async (categories, subcategories) => {
        set({
          categories: sortByOrder(categories),
          subcategories: sortByOrder(subcategories),
          setupComplete: true,
        });
        if (get().dataMode === "supabase") {
          const userId = getOrCreateUserId();
          await Promise.all([
            ...categories.map((category) => api.createCategory(category, userId)),
            ...subcategories.map((subcategory) =>
              api.createSubcategory(subcategory, userId),
            ),
          ]);
        }
      },
      seedDefaults: async () => {
        const seedCategories: Category[] = [];
        const seedSubcategories: Subcategory[] = [];
        defaultCategorySeeds.forEach((seed, index) => {
          const categoryId = createId();
          seedCategories.push({
            id: categoryId,
            name: seed.name,
            order: index + 1,
          });
          const subcats = seed.subcategories.length
            ? seed.subcategories
            : [seed.name];
          subcats.forEach((subcat, subIndex) => {
            seedSubcategories.push({
              id: createId(),
              categoryId,
              name: subcat,
              order: subIndex + 1,
            });
          });
        });
        await get().completeSetup(seedCategories, seedSubcategories);
      },
      addCategory: async (name) => {
        const trimmed = name.trim();
        if (!trimmed) {
          set({ error: "Category name cannot be empty." });
          return;
        }
        if (
          get().categories.some(
            (category) =>
              normalizeText(category.name) === normalizeText(trimmed),
          )
        ) {
          set({ error: "That category already exists." });
          return;
        }
        const category: Category = {
          id: createId(),
          name: trimmed,
          order: get().categories.length + 1,
        };
        const subcategory: Subcategory = {
          id: createId(),
          categoryId: category.id,
          name: trimmed,
          order: 1,
        };
        set((state) => ({
          categories: [...state.categories, category],
          subcategories: [...state.subcategories, subcategory],
        }));
        if (get().dataMode === "supabase") {
          const userId = getOrCreateUserId();
          await api.createCategory(category, userId);
          await api.createSubcategory(subcategory, userId);
        }
      },
      updateCategory: async (id, name) => {
        const trimmed = name.trim();
        if (!trimmed) {
          set({ error: "Category name cannot be empty." });
          return;
        }
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, name: trimmed } : category,
          ),
          subcategories: state.subcategories.map((subcategory) =>
            subcategory.categoryId === id &&
            normalizeText(subcategory.name) ===
              normalizeText(
                state.categories.find((category) => category.id === id)?.name ??
                  "",
              )
              ? { ...subcategory, name: trimmed }
              : subcategory,
          ),
        }));
        if (get().dataMode === "supabase") {
          const category = get().categories.find((item) => item.id === id);
          if (!category) return;
          const userId = getOrCreateUserId();
          await api.updateCategory(category, userId);
        }
      },
      removeCategory: async (id) => {
        const itemsToRemove = get().items.filter(
          (item) => item.categoryId === id,
        );
        const itemIdsToRemove = itemsToRemove.map((item) => item.id);
        const updatedOutfits = get()
          .outfits.map((outfit) => ({
            ...outfit,
            itemIds: outfit.itemIds.filter(
              (itemId) => !itemIdsToRemove.includes(itemId),
            ),
          }))
          .filter((outfit) => outfit.itemIds.length > 0);
        const removedOutfitIds = get()
          .outfits.filter(
            (outfit) =>
              outfit.itemIds.some((itemId) =>
                itemIdsToRemove.includes(itemId),
              ) && outfit.itemIds.length === 1,
          )
          .map((outfit) => outfit.id);
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
          subcategories: state.subcategories.filter(
            (subcategory) => subcategory.categoryId !== id,
          ),
          items: state.items.filter((item) => item.categoryId !== id),
          outfits: updatedOutfits,
          plans: state.plans.filter(
            (plan) => !removedOutfitIds.includes(plan.outfitId),
          ),
        }));
        if (get().dataMode === "supabase") {
          const userId = getOrCreateUserId();
          await api.deleteCategory(id, userId);
        }
      },
      addSubcategory: async (categoryId, name) => {
        const trimmed = name.trim();
        if (!trimmed) {
          set({ error: "Subcategory name cannot be empty." });
          return;
        }
        if (
          get().subcategories.some(
            (subcategory) =>
              subcategory.categoryId === categoryId &&
              normalizeText(subcategory.name) === normalizeText(trimmed),
          )
        ) {
          set({ error: "That subcategory already exists." });
          return;
        }
        const order =
          get().subcategories.filter(
            (subcategory) => subcategory.categoryId === categoryId,
          ).length + 1;
        const subcategory: Subcategory = {
          id: createId(),
          categoryId,
          name: trimmed,
          order,
        };
        set((state) => ({
          subcategories: [...state.subcategories, subcategory],
        }));
        if (get().dataMode === "supabase") {
          const userId = getOrCreateUserId();
          await api.createSubcategory(subcategory, userId);
        }
      },
      updateSubcategory: async (id, name) => {
        const trimmed = name.trim();
        if (!trimmed) {
          set({ error: "Subcategory name cannot be empty." });
          return;
        }
        set((state) => ({
          subcategories: state.subcategories.map((subcategory) =>
            subcategory.id === id ? { ...subcategory, name: trimmed } : subcategory,
          ),
        }));
        if (get().dataMode === "supabase") {
          const subcategory = get().subcategories.find((item) => item.id === id);
          if (!subcategory) return;
          const userId = getOrCreateUserId();
          await api.updateSubcategory(subcategory, userId);
        }
      },
      removeSubcategory: async (id) => {
        const subcategory = get().subcategories.find((item) => item.id === id);
        if (!subcategory) return;
        const remaining = get().subcategories.filter((item) => item.id !== id);
        let defaultSubcategory = findDefaultSubcategory(
          remaining,
          subcategory.categoryId,
        );
        let updatedSubcategories = remaining;
        if (!defaultSubcategory) {
          const categoryName =
            get().categories.find((category) => category.id === subcategory.categoryId)
              ?.name ?? "General";
          defaultSubcategory = {
            id: createId(),
            categoryId: subcategory.categoryId,
            name: categoryName,
            order: 1,
          };
          updatedSubcategories = [...remaining, defaultSubcategory];
        }
        set((state) => ({
          subcategories: updatedSubcategories,
          items: state.items.map((item) =>
            item.subcategoryId === id
              ? { ...item, subcategoryId: defaultSubcategory!.id }
              : item,
          ),
        }));
        if (get().dataMode === "supabase") {
          const userId = getOrCreateUserId();
          await api.deleteSubcategory(id, userId);
        }
      },
      addItem: async (payload) => {
        const item: WardrobeItem = {
          id: createId(),
          createdAt: toISO(),
          isFavorite: false,
          ...payload,
        };
        set((state) => ({ items: [item, ...state.items] }));
        if (get().dataMode === "supabase") {
          const userId = getOrCreateUserId();
          await api.createItem(item, userId);
        }
        return item;
      },
      updateItem: async (payload) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === payload.id ? { ...payload } : item,
          ),
        }));
        if (get().dataMode === "supabase") {
          const userId = getOrCreateUserId();
          await api.updateItem(payload, userId);
        }
      },
      removeItem: async (id) => {
        const updatedOutfits = get()
          .outfits.map((outfit) => ({
            ...outfit,
            itemIds: outfit.itemIds.filter((itemId) => itemId !== id),
          }))
          .filter((outfit) => outfit.itemIds.length > 0);
        const removedOutfitIds = get()
          .outfits.filter(
            (outfit) => outfit.itemIds.includes(id) && outfit.itemIds.length === 1,
          )
          .map((outfit) => outfit.id);
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          outfits: updatedOutfits,
          plans: state.plans.filter(
            (plan) => !removedOutfitIds.includes(plan.outfitId),
          ),
        }));
        if (get().dataMode === "supabase") {
          const userId = getOrCreateUserId();
          await api.deleteItem(id, userId);
        }
      },
      toggleItemFavorite: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
          ),
        }));
      },
      addOutfit: async (payload) => {
        const outfit: Outfit = {
          id: createId(),
          createdAt: toISO(),
          isFavorite: payload.isFavorite ?? false,
          name: payload.name?.trim() || undefined,
          itemIds: payload.itemIds,
        };
        set((state) => ({ outfits: [outfit, ...state.outfits] }));
        if (get().dataMode === "supabase") {
          const userId = getOrCreateUserId();
          await api.createOutfit(outfit, userId);
        }
      },
      updateOutfit: async (payload) => {
        set((state) => ({
          outfits: state.outfits.map((outfit) =>
            outfit.id === payload.id ? { ...payload } : outfit,
          ),
        }));
        if (get().dataMode === "supabase") {
          const userId = getOrCreateUserId();
          await api.updateOutfit(payload, userId);
        }
      },
      removeOutfit: async (id) => {
        set((state) => ({
          outfits: state.outfits.filter((outfit) => outfit.id !== id),
          plans: state.plans.filter((plan) => plan.outfitId !== id),
        }));
        if (get().dataMode === "supabase") {
          const userId = getOrCreateUserId();
          await api.deleteOutfit(id, userId);
        }
      },
      toggleOutfitFavorite: (id) => {
        set((state) => ({
          outfits: state.outfits.map((outfit) =>
            outfit.id === id ? { ...outfit, isFavorite: !outfit.isFavorite } : outfit,
          ),
        }));
      },
      addPlan: async (payload) => {
        const existing = get().plans.find(
          (plan) => plan.plannedDate === payload.plannedDate,
        );
        if (existing) {
          const updated: PlanEntry = {
            ...existing,
            outfitId: payload.outfitId,
            description: payload.description,
          };
          set((state) => ({
            plans: state.plans.map((plan) =>
              plan.id === existing.id ? updated : plan,
            ),
          }));
          if (get().dataMode === "supabase") {
            const userId = getOrCreateUserId();
            await api.updatePlan(updated, userId);
          }
          return;
        }
        const plan: PlanEntry = {
          id: createId(),
          createdAt: toISO(),
          ...payload,
        };
        set((state) => ({ plans: [...state.plans, plan] }));
        if (get().dataMode === "supabase") {
          const userId = getOrCreateUserId();
          await api.createPlan(plan, userId);
        }
      },
      updatePlan: async (payload) => {
        set((state) => ({
          plans: state.plans.map((plan) =>
            plan.id === payload.id ? { ...payload } : plan,
          ),
        }));
        if (get().dataMode === "supabase") {
          const userId = getOrCreateUserId();
          await api.updatePlan(payload, userId);
        }
      },
      removePlan: async (id) => {
        set((state) => ({
          plans: state.plans.filter((plan) => plan.id !== id),
        }));
        if (get().dataMode === "supabase") {
          const userId = getOrCreateUserId();
          await api.deletePlan(id, userId);
        }
      },
    }),
    {
      name: "wardrope-store",
      partialize: (state) => ({
        categories: state.categories,
        subcategories: state.subcategories,
        items: state.items,
        outfits: state.outfits,
        plans: state.plans,
        setupComplete: state.setupComplete,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
