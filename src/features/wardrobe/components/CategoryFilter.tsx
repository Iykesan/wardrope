"use client";

import type { Category, Subcategory } from "@/shared/types";

type CategoryFilterProps = {
  categories: Category[];
  subcategories: Subcategory[];
  activeCategoryId?: string;
  activeSubcategoryId?: string;
  onCategorySelect: (id?: string) => void;
  onSubcategorySelect: (id?: string) => void;
};

export default function CategoryFilter({
  categories,
  subcategories,
  activeCategoryId,
  activeSubcategoryId,
  onCategorySelect,
  onSubcategorySelect,
}: CategoryFilterProps) {
  const filteredSubcategories = subcategories.filter(
    (subcategory) => subcategory.categoryId === activeCategoryId,
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-widest text-muted">
          Categories
        </div>
        <div className="flex flex-col gap-1">
          <button
            className={`rounded-lg px-3 py-2 text-left text-sm transition ${
              !activeCategoryId
                ? "bg-accent-soft text-accent"
                : "text-ink hover:bg-white/80"
            }`}
            onClick={() => onCategorySelect(undefined)}
            type="button"
          >
            All Items
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                activeCategoryId === category.id
                  ? "bg-accent-soft text-accent"
                  : "text-ink hover:bg-white/80"
              }`}
              onClick={() => onCategorySelect(category.id)}
              type="button"
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {activeCategoryId && (
        <div className="flex flex-col gap-2">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted">
            Subcategories
          </div>
          <div className="flex flex-col gap-1">
            <button
              className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                !activeSubcategoryId
                  ? "bg-accent-soft text-accent"
                  : "text-ink hover:bg-white/80"
              }`}
              onClick={() => onSubcategorySelect(undefined)}
              type="button"
            >
              All {categories.find((item) => item.id === activeCategoryId)?.name}
            </button>
            {filteredSubcategories.map((subcategory) => (
              <button
                key={subcategory.id}
                className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                  activeSubcategoryId === subcategory.id
                    ? "bg-accent-soft text-accent"
                    : "text-ink hover:bg-white/80"
                }`}
                onClick={() => onSubcategorySelect(subcategory.id)}
                type="button"
              >
                {subcategory.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
