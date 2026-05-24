import { NextResponse } from "next/server";
import { getUserId, jsonError } from "@/server/api/helpers";
import type { Category } from "@/shared/types";
import { deleteCategory, insertCategory, updateCategory } from "@/server/supabase/queries";

export async function POST(request: Request) {
  const userId = getUserId(request);
  if (!userId) return jsonError("Missing user id.", 400);
  const payload = (await request.json()) as Category;
  try {
    await insertCategory(payload, userId);
    return NextResponse.json(payload);
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unable to create category.",
    );
  }
}

export async function PATCH(request: Request) {
  const userId = getUserId(request);
  if (!userId) return jsonError("Missing user id.", 400);
  const payload = (await request.json()) as Category;
  try {
    await updateCategory(payload, userId);
    return NextResponse.json(payload);
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unable to update category.",
    );
  }
}

export async function DELETE(request: Request) {
  const userId = getUserId(request);
  if (!userId) return jsonError("Missing user id.", 400);
  const payload = (await request.json()) as { id: string };
  try {
    await deleteCategory(payload.id, userId);
    return NextResponse.json({ id: payload.id });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unable to delete category.",
    );
  }
}
