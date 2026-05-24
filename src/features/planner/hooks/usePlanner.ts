import { useShallow } from "zustand/react/shallow";
import { useWardrobeStore } from "@/features/wardrobe/store/wardrobeStore";

export const usePlanner = () =>
  useWardrobeStore(
    useShallow((state) => ({
      plans: state.plans,
      addPlan: state.addPlan,
      updatePlan: state.updatePlan,
      removePlan: state.removePlan,
    })),
  );
