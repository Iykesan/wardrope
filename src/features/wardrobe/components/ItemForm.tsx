"use client";

import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import Button from "@/shared/components/common/Button";
import InputField from "@/shared/components/common/InputField";
import Modal from "@/shared/components/common/Modal";
import ItemVisual from "@/features/wardrobe/components/ItemVisual";
import {
  getSuggestionsForSubcategory,
  type SuggestedItemTemplate,
} from "@/features/wardrobe/suggestions";
import { normalizeText } from "@/shared/lib/utils";
import { itemSchema } from "@/shared/lib/validation";
import type { Category, Subcategory, WardrobeItem } from "@/shared/types";

type ItemFormValues = {
  name: string;
  categoryId: string;
  subcategoryId: string;
  visualKey?: string;
  color?: string;
  fit?: string;
  season?: string;
  notes?: string;
};

type ItemFormProps = {
  open: boolean;
  categories: Category[];
  subcategories: Subcategory[];
  initial?: WardrobeItem;
  onClose: () => void;
  onSave: (values: ItemFormValues) => void | Promise<void>;
};

export default function ItemForm({
  open,
  categories,
  subcategories,
  initial,
  onClose,
  onSave,
}: ItemFormProps) {
  const defaultCategoryId = initial?.categoryId ?? categories[0]?.id ?? "";
  const defaultSubcategoryId =
    initial?.subcategoryId ??
    subcategories.find((subcategory) => subcategory.categoryId === defaultCategoryId)
      ?.id ??
    "";
  const defaultSubcategoryName =
    subcategories.find((subcategory) => subcategory.id === defaultSubcategoryId)
      ?.name ?? "";
  const defaultSuggestions = getSuggestionsForSubcategory(defaultSubcategoryName);
  const defaultTemplate = initial ? undefined : defaultSuggestions[0];
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    formState: { errors },
  } = useForm<ItemFormValues>({
    defaultValues: {
      name: initial?.name ?? defaultTemplate?.name ?? "",
      categoryId: defaultCategoryId,
      subcategoryId: defaultSubcategoryId,
      visualKey: initial?.visualKey ?? defaultTemplate?.visualKey ?? "",
      color: initial?.color ?? defaultTemplate?.color ?? "",
      fit: initial?.fit ?? defaultTemplate?.fit ?? "",
      season: initial?.season ?? defaultTemplate?.season ?? "",
      notes: initial?.notes ?? defaultTemplate?.notes ?? "",
    },
  });

  const [showDetails, setShowDetails] = useState(
    Boolean(initial?.color || initial?.fit || initial?.season || initial?.notes),
  );
  const categoryId = useWatch({ control, name: "categoryId" });
  const subcategoryId = useWatch({ control, name: "subcategoryId" });
  const selectedName = useWatch({ control, name: "name" });
  const availableSubcategories = useMemo(
    () =>
      subcategories.filter((subcategory) => subcategory.categoryId === categoryId),
    [categoryId, subcategories],
  );
  const selectedSubcategory = useMemo(
    () => subcategories.find((subcategory) => subcategory.id === subcategoryId),
    [subcategoryId, subcategories],
  );
  const suggestionOptions = useMemo(() => {
    const options = getSuggestionsForSubcategory(selectedSubcategory?.name);
    if (
      initial &&
      initial.subcategoryId === subcategoryId &&
      !options.some(
        (option) =>
          normalizeText(option.name) === normalizeText(initial.name ?? ""),
      )
    ) {
      return [
        {
          name: initial.name,
          color: initial.color,
          fit: initial.fit,
          season: initial.season,
          notes: initial.notes,
        },
        ...options,
      ];
    }
    return options;
  }, [selectedSubcategory?.name, initial, subcategoryId]);

  const applySuggestionTemplate = (template?: SuggestedItemTemplate) => {
    if (!template) return;
    setValue("name", template.name);
    setValue("visualKey", template.visualKey ?? "");
    setValue("color", template.color ?? "");
    setValue("fit", template.fit ?? "");
    setValue("season", template.season ?? "");
    setValue("notes", template.notes ?? "");
  };

  const categoryRegister = register("categoryId", {
    onChange: (event) => {
      const nextCategoryId = event.target.value as string;
      const fallback = subcategories.find(
        (subcategory) => subcategory.categoryId === nextCategoryId,
      )?.id;
      if (!fallback) return;
      const fallbackSubcategory = subcategories.find(
        (subcategory) => subcategory.id === fallback,
      );
      const suggestions = getSuggestionsForSubcategory(
        fallbackSubcategory?.name,
      );
      setValue("subcategoryId", fallback);
      applySuggestionTemplate(suggestions[0]);
    },
  });
  const subcategoryRegister = register("subcategoryId", {
    onChange: (event) => {
      const nextSubcategoryId = event.target.value as string;
      const nextSubcategory = subcategories.find(
        (subcategory) => subcategory.id === nextSubcategoryId,
      );
      const suggestions = getSuggestionsForSubcategory(nextSubcategory?.name);
      applySuggestionTemplate(suggestions[0]);
    },
  });

  const submitHandler = handleSubmit(async (values) => {
    const result = itemSchema.safeParse(values);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ItemFormValues;
        setError(field, { message: issue.message });
      });
      return;
    }
    await onSave(result.data);
    onClose();
  });

  return (
    <Modal
      open={open}
      title={initial ? "Edit item" : "Add item"}
      onClose={onClose}
    >
      <form className="flex flex-col gap-4" onSubmit={submitHandler}>
        <input type="hidden" {...register("visualKey")} />

        <InputField
          label="Item name"
          placeholder="Blue denim jacket"
          error={errors.name?.message}
          {...register("name", {
            onChange: () => {
              // Clear custom visual key so the subcategory icon stays in sync.
              setValue("visualKey", "");
            },
          })}
        />

        <label className="flex flex-col gap-1 text-sm text-muted">
          <span className="font-medium text-ink">Category</span>
          <select
            className="rounded-xl border border-border bg-white/90 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            {...categoryRegister}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId?.message && (
            <span className="text-xs text-danger">{errors.categoryId.message}</span>
          )}
        </label>

        <label className="flex flex-col gap-1 text-sm text-muted">
          <span className="font-medium text-ink">Subcategory</span>
          <select
            className="rounded-xl border border-border bg-white/90 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            {...subcategoryRegister}
          >
            <option value="" disabled>
              Select a subcategory
            </option>
            {availableSubcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
          {errors.subcategoryId?.message && (
            <span className="text-xs text-danger">
              {errors.subcategoryId.message}
            </span>
          )}
        </label>

        {selectedSubcategory ? (
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface/60 p-4">
            <div>
              <div className="text-sm font-semibold text-ink">
                Item options
              </div>
              <p className="text-xs text-muted">
                Choose from the preset library for this subcategory.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {suggestionOptions.map((option) => {
                const isSelected =
                  normalizeText(option.name) === normalizeText(selectedName ?? "");
                return (
                  <button
                    key={option.name}
                    type="button"
                    onClick={() => applySuggestionTemplate(option)}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                      isSelected
                        ? "border-accent bg-accent-soft"
                        : "border-border bg-white/90 hover:border-accent/50"
                    }`}
                  >
                    <ItemVisual
                      label={option.name}
                      visualKey={option.visualKey}
                      color={option.color}
                      size="sm"
                    />
                    <div>
                      <div className="text-sm font-semibold text-ink">
                        {option.name}
                      </div>
                      <div className="text-xs text-muted">
                        {option.color ?? "Everyday staple"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-surface/60 px-4 py-3 text-xs text-muted">
            Pick a category and subcategory to see available item options.
          </div>
        )}

        <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border bg-surface/60 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-ink">Extra details</div>
              <p className="text-xs text-muted">
                Optional. Add color, fit, season, or notes when you have time.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails((prev) => !prev)}
            >
              {showDetails ? "Hide" : "Add details"}
            </Button>
          </div>

          {showDetails && (
            <div className="grid gap-3 sm:grid-cols-2">
              <InputField label="Color" {...register("color")} />
              <InputField label="Fit" {...register("fit")} />
              <InputField label="Season" {...register("season")} />
              <label className="flex flex-col gap-1 text-sm text-muted sm:col-span-2">
                <span className="font-medium text-ink">Notes</span>
                <textarea
                  className="min-h-[96px] rounded-xl border border-border bg-white/90 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  {...register("notes")}
                />
              </label>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{initial ? "Save changes" : "Save item"}</Button>
        </div>
      </form>
    </Modal>
  );
}
