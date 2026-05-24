import type {
  Category,
  Subcategory,
  WardrobeItem,
  Outfit,
  PlanEntry,
} from "@/shared/types";

type BootstrapResponse = {
  categories: Category[];
  subcategories: Subcategory[];
  items: WardrobeItem[];
  outfits: Outfit[];
  plans: PlanEntry[];
};

const jsonHeaders = (userId: string) => ({
  "Content-Type": "application/json",
  "x-user-id": userId,
});

const request = async <T>(
  path: string,
  options: RequestInit,
  userId: string,
) => {
  const response = await fetch(path, {
    ...options,
    headers: jsonHeaders(userId),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed.");
  }

  return (await response.json()) as T;
};

export const api = {
  bootstrap: (userId: string) =>
    request<BootstrapResponse>(
      `/api/bootstrap?userId=${encodeURIComponent(userId)}`,
      { method: "GET" },
      userId,
    ),
  createCategory: (payload: Category, userId: string) =>
    request<Category>("/api/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    }, userId),
  updateCategory: (payload: Category, userId: string) =>
    request<Category>("/api/categories", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }, userId),
  deleteCategory: (id: string, userId: string) =>
    request<{ id: string }>("/api/categories", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    }, userId),
  createSubcategory: (payload: Subcategory, userId: string) =>
    request<Subcategory>("/api/subcategories", {
      method: "POST",
      body: JSON.stringify(payload),
    }, userId),
  updateSubcategory: (payload: Subcategory, userId: string) =>
    request<Subcategory>("/api/subcategories", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }, userId),
  deleteSubcategory: (id: string, userId: string) =>
    request<{ id: string }>("/api/subcategories", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    }, userId),
  createItem: (payload: WardrobeItem, userId: string) =>
    request<WardrobeItem>("/api/items", {
      method: "POST",
      body: JSON.stringify(payload),
    }, userId),
  updateItem: (payload: WardrobeItem, userId: string) =>
    request<WardrobeItem>("/api/items", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }, userId),
  deleteItem: (id: string, userId: string) =>
    request<{ id: string }>("/api/items", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    }, userId),
  createOutfit: (payload: Outfit, userId: string) =>
    request<Outfit>("/api/outfits", {
      method: "POST",
      body: JSON.stringify(payload),
    }, userId),
  updateOutfit: (payload: Outfit, userId: string) =>
    request<Outfit>("/api/outfits", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }, userId),
  deleteOutfit: (id: string, userId: string) =>
    request<{ id: string }>("/api/outfits", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    }, userId),
  createPlan: (payload: PlanEntry, userId: string) =>
    request<PlanEntry>("/api/plans", {
      method: "POST",
      body: JSON.stringify(payload),
    }, userId),
  updatePlan: (payload: PlanEntry, userId: string) =>
    request<PlanEntry>("/api/plans", {
      method: "PATCH",
      body: JSON.stringify(payload),
    }, userId),
  deletePlan: (id: string, userId: string) =>
    request<{ id: string }>("/api/plans", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    }, userId),
};
