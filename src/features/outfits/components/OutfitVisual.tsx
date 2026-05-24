"use client";

import ItemVisual from "@/features/wardrobe/components/ItemVisual";

export type OutfitVisualItem = {
  id?: string;
  name: string;
  color?: string;
  visualKey?: string;
};

type OutfitVisualProps = {
  items: OutfitVisualItem[];
  compact?: boolean;
};

const getColumns = (count: number) => {
  if (count <= 1) return 1;
  if (count <= 4) return 2;
  if (count <= 9) return 3;
  return 4;
};

export default function OutfitVisual({ items, compact }: OutfitVisualProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface/60 px-3 py-4 text-xs text-muted">
        No items selected yet.
      </div>
    );
  }

  const columns = getColumns(items.length);
  const size = compact ? "sm" : "md";
  const gapClass = compact ? "gap-1.5" : "gap-2";
  const paddingClass = compact ? "p-2" : "p-3";

  return (
    <div
      className={`rounded-xl border border-border bg-surface/70 ${paddingClass}`}
    >
      <div
        className={`grid ${gapClass}`}
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {items.map((item, index) => (
          <div key={item.id ?? `${item.name}-${index}`} className="flex justify-center">
            <ItemVisual
              label={item.name}
              visualKey={item.visualKey}
              color={item.color}
              size={size}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
