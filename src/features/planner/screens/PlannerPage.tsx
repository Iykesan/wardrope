"use client";

import { CalendarDays } from "lucide-react";
import { useOutfits } from "@/features/outfits/hooks/useOutfits";
import CalendarView from "@/features/planner/components/CalendarView";
import { usePlanner } from "@/features/planner/hooks/usePlanner";
import { useWardrobe } from "@/features/wardrobe/hooks/useWardrobe";
import InlineNotice from "@/shared/components/common/InlineNotice";
import { useFeedback } from "@/shared/hooks/useFeedback";

export default function PlannerPage() {
  const { outfits } = useOutfits();
  const { plans, addPlan, removePlan } = usePlanner();
  const { items, isLoading, error, setError } = useWardrobe();
  const { feedback, show, clear } = useFeedback();

  const handleAddPlan = async (payload: {
    plannedDate: string;
    outfitId: string;
    description?: string;
  }) => {
    const existing = plans.find((plan) => plan.plannedDate === payload.plannedDate);
    await addPlan(payload);
    show({
      type: "success",
      message: existing ? "Plan updated." : "Plan scheduled.",
    });
  };

  const handleRemovePlan = async (id: string) => {
    await removePlan(id);
    show({ type: "success", message: "Plan removed." });
  };

  return (
    <div className="flex flex-col gap-8">
      {(isLoading || error || feedback) && (
        <div className="flex flex-col gap-3">
          {isLoading && <InlineNotice>Loading planner...</InlineNotice>}
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
      <header className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-soft text-accent">
          <CalendarDays size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-ink">Planner</h1>
          <p className="text-sm text-muted">Assign outfits to future dates.</p>
        </div>
      </header>

      {outfits.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-border bg-surface/60 px-6 py-10 text-center text-sm text-muted">
          Save an outfit before planning your week.
        </div>
      ) : (
        <CalendarView
          outfits={outfits}
          items={items}
          plans={plans}
          onAddPlan={handleAddPlan}
          onRemovePlan={handleRemovePlan}
        />
      )}
    </div>
  );
}
