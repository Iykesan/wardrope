"use client";

import { useMemo } from "react";
import {
  getVisualKeyForSubcategory,
  resolveVisualKey,
  visualStyles,
  type VisualKey,
} from "@/shared/config/visuals";
import { normalizeText } from "@/shared/lib/utils";

type ItemVisualProps = {
  label: string;
  visualKey?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
};

const colorMap: Record<string, string> = {
  white: "#f8fafc",
  black: "#111827",
  gray: "#6b7280",
  charcoal: "#374151",
  navy: "#1e3a8a",
  blue: "#2563eb",
  indigo: "#4338ca",
  tan: "#d6a874",
  brown: "#7c3f22",
  camel: "#c08457",
  khaki: "#a16207",
  cream: "#fef3c7",
  olive: "#3f6212",
  gold: "#d97706",
  silver: "#9ca3af",
  neutral: "#e5e7eb",
  denim: "#1f3b72",
  stone: "#d1d5db",
};

const sizeMap: Record<
  NonNullable<ItemVisualProps["size"]>,
  { wrapper: string; icon: number }
> = {
  sm: { wrapper: "h-10 w-10", icon: 18 },
  md: { wrapper: "h-14 w-14", icon: 22 },
  lg: { wrapper: "h-16 w-16", icon: 26 },
};

export default function ItemVisual({
  label,
  visualKey,
  color,
  size = "md",
}: ItemVisualProps) {
  const resolvedKey = visualKey
    ? resolveVisualKey(visualKey)
    : getVisualKeyForSubcategory(label);
  const style = visualStyles[resolvedKey as VisualKey];
  const swatch = useMemo(() => {
    if (!color) return undefined;
    const normalized = normalizeText(color);
    return colorMap[normalized];
  }, [color]);
  const sizeTokens = sizeMap[size];
  const Icon = style.icon;

  return (
    <div
      className={`relative flex items-center justify-center rounded-2xl border border-border ${sizeTokens.wrapper}`}
      style={{ background: style.background }}
      title={label}
    >
      <Icon size={sizeTokens.icon} strokeWidth={1.8} color={style.accent} />
      {swatch && (
        <span
          className="absolute bottom-1.5 right-1.5 h-3 w-3 rounded-full border border-white/80"
          style={{ backgroundColor: swatch }}
        />
      )}
    </div>
  );
}
