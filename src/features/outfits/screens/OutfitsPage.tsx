"use client";

import { useMemo, useState } from "react";
import { Layers } from "lucide-react";
import OutfitBuilder from "@/features/outfits/components/OutfitBuilder";
import OutfitCard from "@/features/outfits/components/OutfitCard";
import OutfitVisual from "@/features/outfits/components/OutfitVisual";
import { useOutfits } from "@/features/outfits/hooks/useOutfits";
import { buildOutfitFromTemplate } from "@/features/outfits/lib/outfitSuggestions";
import {
  formatItemName,
  generateOutfitTemplates,
  type OutfitTemplate,
} from "@/features/outfits/templates";
import { useWardrobe } from "@/features/wardrobe/hooks/useWardrobe";
import Button from "@/shared/components/common/Button";
import InlineNotice from "@/shared/components/common/InlineNotice";
import { useFeedback } from "@/shared/hooks/useFeedback";
import type { Outfit } from "@/shared/types";

export default function OutfitsPage() {
  const { outfits, addOutfit, updateOutfit, removeOutfit, toggleOutfitFavorite } =
    useOutfits();
  const {
    items,
    categories,
    subcategories,
    addItem,
    isLoading,
    error,
    setError,
  } = useWardrobe();
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editingOutfit, setEditingOutfit] = useState<Outfit | undefined>();
  const { feedback, show, clear } = useFeedback();
  const [visibleCount, setVisibleCount] = useState(12);
  const [addingIndex, setAddingIndex] = useState<number | null>(null);

  const suggestedOutfits = useMemo(() => generateOutfitTemplates(240), []);
  const visibleSuggestions = useMemo(
    () => suggestedOutfits.slice(0, visibleCount),
    [suggestedOutfits, visibleCount],
  );
  const canSuggest = categories.length > 0 && subcategories.length > 0;

  const openCreate = () => {
    setEditingOutfit(undefined);
    setBuilderOpen(true);
  };

  const openEdit = (outfit: Outfit) => {
    setEditingOutfit(outfit);
    setBuilderOpen(true);
  };

  const handleRemoveOutfit = async (id: string) => {
    await removeOutfit(id);
    show({ type: "success", message: "Outfit deleted." });
  };

  const handleAddSuggested = async (template: OutfitTemplate, index: number) => {
    if (!canSuggest || addingIndex !== null) return;
    setAddingIndex(index);
    try {
      await buildOutfitFromTemplate({
        template,
        categories,
        subcategories,
        items,
        addItem,
        addOutfit,
      });
      show({ type: "success", message: "Suggested outfit added." });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to add that outfit.";
      show({ type: "error", message });
    } finally {
      setAddingIndex(null);
    }
  };

  const showMoreSuggestions = () => {
    setVisibleCount((prev) => Math.min(prev + 12, suggestedOutfits.length));
  };

  return (
    <div className="flex flex-col gap-8">
      {(isLoading || error || feedback) && (
        <div className="flex flex-col gap-3">
          {isLoading && <InlineNotice>Loading outfits...</InlineNotice>}
          {error && (
            <InlineNotice variant="error" onDismiss={() => setError(undefined)}>
              {error}
            </InlineNotice>
          )}
          {feedback && (
            <InlineNotice variant={feedback.type} onDismiss={clear}>
              {feedback.message}
            </InlineNotice>
          )}
        </div>
      )}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <Layers size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-ink">Outfits</h1>
            <p className="text-sm text-muted">{outfits.length} saved outfits</p>
          </div>
        </div>
        <Button onClick={openCreate}>Create outfit</Button>
      </header>

      {canSuggest ? (
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-lg font-semibold text-ink">
                Suggested outfits
              </div>
              <p className="text-sm text-muted">
                Quick-start looks. We will add any missing items automatically.
              </p>
            </div>
            <div className="text-xs text-muted">
              {Math.min(visibleCount, suggestedOutfits.length)} of{" "}
              {suggestedOutfits.length}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleSuggestions.map((template, index) => (
              <div
                key={`${template.name}-${index}`}
                className="flex h-full flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-white/90 p-4 shadow-sm"
              >
                <div className="text-sm font-semibold text-ink">
                  {template.name}
                </div>
                <OutfitVisual
                  items={template.itemTemplates.map((item, itemIndex) => ({
                    id: `${item.name}-${item.color}-${itemIndex}`,
                    name: formatItemName(item),
                    color: item.color,
                    visualKey: item.visualKey,
                  }))}
                />
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs text-muted">
                    {template.itemTemplates.length} pieces
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleAddSuggested(template, index)}
                    disabled={addingIndex !== null}
                  >
                    {addingIndex === index ? "Adding..." : "Add outfit"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {visibleCount < suggestedOutfits.length && (
            <Button size="sm" variant="secondary" onClick={showMoreSuggestions}>
              Show more
            </Button>
          )}
        </section>
      ) : (
        <InlineNotice>Complete setup to unlock suggested outfits.</InlineNotice>
      )}

      {outfits.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-border bg-surface/60 px-6 py-10 text-center">
          <div className="text-sm font-semibold text-ink">No outfits yet</div>
          <p className="text-sm text-muted">
            Build your own or add from suggestions above.
          </p>
          <Button size="sm" onClick={openCreate}>
            Build an outfit
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {outfits.map((outfit) => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              items={items}
              onEdit={openEdit}
              onDelete={handleRemoveOutfit}
              onToggleFavorite={toggleOutfitFavorite}
            />
          ))}
        </div>
      )}

      <OutfitBuilder
        key={`${editingOutfit?.id ?? "new"}-${builderOpen ? "open" : "closed"}`}
        open={builderOpen}
        items={items}
        initial={editingOutfit}
        onClose={() => setBuilderOpen(false)}
        onSave={async (payload) => {
          if (editingOutfit) {
            await updateOutfit({
              ...editingOutfit,
              ...payload,
            });
            show({ type: "success", message: "Outfit updated." });
          } else {
            await addOutfit(payload);
            show({ type: "success", message: "Outfit created." });
          }
        }}
      />
    </div>
  );
}
