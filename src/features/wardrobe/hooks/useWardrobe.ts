import { useShallow } from "zustand/react/shallow";
import { useWardrobeStore } from "@/features/wardrobe/store/wardrobeStore";

export const useWardrobe = () =>
  useWardrobeStore(
    useShallow((state) => ({
      categories: state.categories,
      subcategories: state.subcategories,
      items: state.items,
      setupComplete: state.setupComplete,
      isLoading: state.isLoading,
      error: state.error,
      setError: state.setError,
      addItem: state.addItem,
      updateItem: state.updateItem,
      removeItem: state.removeItem,
      toggleItemFavorite: state.toggleItemFavorite,
      addCategory: state.addCategory,
      updateCategory: state.updateCategory,
      removeCategory: state.removeCategory,
      addSubcategory: state.addSubcategory,
      updateSubcategory: state.updateSubcategory,
      removeSubcategory: state.removeSubcategory,
      seedDefaults: state.seedDefaults,
      completeSetup: state.completeSetup,
    })),
  );
