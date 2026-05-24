import { NextResponse } from "next/server";
import { getUserId, jsonError } from "@/server/api/helpers";
import type { Subcategory } from "@/shared/types";
import {
  deleteSubcategory,
  insertSubcategory,
  updateSubcategory,
} from "@/server/supabase/queries";

export async function POST(request: Request) {
  const userId = getUserId(request);
  if (!userId) return jsonError("Missing user id.", 400);
  const payload = (await request.json()) as Subcategory;
  try {
    await insertSubcategory(payload, userId);
    return NextResponse.json(payload);
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unable to create subcategory.",
    );
  }
}

export async function PATCH(request: Request) {
  const userId = getUserId(request);
  if (!userId) return jsonError("Missing user id.", 400);
  const payload = (await request.json()) as Subcategory;
  try {
    await updateSubcategory(payload, userId);
    return NextResponse.json(payload);
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unable to update subcategory.",
    );
  }
}

export async function DELETE(request: Request) {
  const userId = getUserId(request);
  if (!userId) return jsonError("Missing user id.", 400);
  const payload = (await request.json()) as { id: string };
  try {
    await deleteSubcategory(payload.id, userId);
    return NextResponse.json({ id: payload.id });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unable to delete subcategory.",
    );
  }
}
