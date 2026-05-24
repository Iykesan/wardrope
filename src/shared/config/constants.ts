export const APP_NAME = "Wardrope";
export const APP_TAGLINE = "A calm, reliable mirror of your wardrobe.";
export const MAX_ITEMS = 500;
export const DATA_MODE =
  process.env.NEXT_PUBLIC_DATA_MODE === "supabase" ? "supabase" : "local";
