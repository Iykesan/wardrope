import { useShallow } from "zustand/react/shallow";
import { useWardrobeStore } from "@/features/wardrobe/store/wardrobeStore";

export const useOutfits = () =>
  useWardrobeStore(
    useShallow((state) => ({
      outfits: state.outfits,
      addOutfit: state.addOutfit,
      updateOutfit: state.updateOutfit,
      removeOutfit: state.removeOutfit,
      toggleOutfitFavorite: state.toggleOutfitFavorite,
    })),
  );
