import {
  Footprints,
  Handbag,
  Layers,
  Shirt,
  Sparkles,
  Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type VisualKey =
  | "top"
  | "bottom"
  | "shoe"
  | "outerwear"
  | "accessory"
  | "generic";

type VisualStyle = {
  icon: LucideIcon;
  background: string;
  accent: string;
};

export const visualStyles: Record<VisualKey, VisualStyle> = {
  top: {
    icon: Shirt,
    background: "linear-gradient(135deg, #fef3f2, #fff7ed)",
    accent: "#ef4444",
  },
  bottom: {
    icon: Layers,
    background: "linear-gradient(135deg, #eef2ff, #eff6ff)",
    accent: "#6366f1",
  },
  shoe: {
    icon: Footprints,
    background: "linear-gradient(135deg, #ecfdf3, #f0fdf4)",
    accent: "#10b981",
  },
  outerwear: {
    icon: Wind,
    background: "linear-gradient(135deg, #fdf4ff, #f5f3ff)",
    accent: "#8b5cf6",
  },
  accessory: {
    icon: Handbag,
    background: "linear-gradient(135deg, #fff7ed, #fffbeb)",
    accent: "#f59e0b",
  },
  generic: {
    icon: Sparkles,
    background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
    accent: "#64748b",
  },
};

const normalizeKey = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

export const resolveVisualKey = (value?: string): VisualKey => {
  if (!value) return "generic";
  const normalized = normalizeKey(value);
  const matches = Object.keys(visualStyles) as VisualKey[];
  const found = matches.find((key) => normalizeKey(key) === normalized);
  return found ?? "generic";
};

export const getVisualKeyForSubcategory = (
  subcategoryName?: string,
): VisualKey => {
  if (!subcategoryName) return "generic";
  const key = normalizeKey(subcategoryName);
  if (["tshirt", "t-shirt", "tee", "shirt", "top", "sweater", "hoodie"].some((value) =>
    key.includes(normalizeKey(value)),
  )) {
    return "top";
  }
  if (["jean", "denim", "pant", "trouser", "short", "skirt", "bottom"].some((value) =>
    key.includes(normalizeKey(value)),
  )) {
    return "bottom";
  }
  if (["shoe", "sneaker", "boot", "sandal", "flat"].some((value) =>
    key.includes(normalizeKey(value)),
  )) {
    return "shoe";
  }
  if (["outerwear", "jacket", "coat", "blazer"].some((value) =>
    key.includes(normalizeKey(value)),
  )) {
    return "outerwear";
  }
  if (["accessory", "bag", "belt", "hat", "cap", "jewel"].some((value) =>
    key.includes(normalizeKey(value)),
  )) {
    return "accessory";
  }
  return "generic";
};
