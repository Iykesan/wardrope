import { NextResponse } from "next/server";
import { getUserId, jsonError } from "@/server/api/helpers";
import type { WardrobeItem } from "@/shared/types";
import { deleteItem, insertItem, updateItem } from "@/server/supabase/queries";

export async function POST(request: Request) {
  const userId = getUserId(request);
  if (!userId) return jsonError("Missing user id.", 400);
  const payload = (await request.json()) as WardrobeItem;
  try {
    await insertItem(payload, userId);
    return NextResponse.json(payload);
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unable to create item.",
    );
  }
}

export async function PATCH(request: Request) {
  const userId = getUserId(request);
  if (!userId) return jsonError("Missing user id.", 400);
  const payload = (await request.json()) as WardrobeItem;
  try {
    await updateItem(payload, userId);
    return NextResponse.json(payload);
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unable to update item.",
    );
  }
}

export async function DELETE(request: Request) {
  const userId = getUserId(request);
  if (!userId) return jsonError("Missing user id.", 400);
  const payload = (await request.json()) as { id: string };
  try {
    await deleteItem(payload.id, userId);
    return NextResponse.json({ id: payload.id });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unable to delete item.",
    );
  }
}
