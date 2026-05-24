import { NextResponse } from "next/server";
import { getUserId, jsonError } from "@/server/api/helpers";
import type { PlanEntry } from "@/shared/types";
import { deletePlan, insertPlan, updatePlan } from "@/server/supabase/queries";

export async function POST(request: Request) {
  const userId = getUserId(request);
  if (!userId) return jsonError("Missing user id.", 400);
  const payload = (await request.json()) as PlanEntry;
  try {
    await insertPlan(payload, userId);
    return NextResponse.json(payload);
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unable to create plan.",
    );
  }
}

export async function PATCH(request: Request) {
  const userId = getUserId(request);
  if (!userId) return jsonError("Missing user id.", 400);
  const payload = (await request.json()) as PlanEntry;
  try {
    await updatePlan(payload, userId);
    return NextResponse.json(payload);
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unable to update plan.",
    );
  }
}

export async function DELETE(request: Request) {
  const userId = getUserId(request);
  if (!userId) return jsonError("Missing user id.", 400);
  const payload = (await request.json()) as { id: string };
  try {
    await deletePlan(payload.id, userId);
    return NextResponse.json({ id: payload.id });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unable to delete plan.",
    );
  }
}
