import { NextResponse } from "next/server";
import { getUserId, jsonError } from "@/server/api/helpers";
import type { Outfit } from "@/shared/types";
import { deleteOutfit, insertOutfit, updateOutfit } from "@/server/supabase/queries";

export async function POST(request: Request) {
  const userId = getUserId(request);
  if (!userId) return jsonError("Missing user id.", 400);
  const payload = (await request.json()) as Outfit;
  try {
    await insertOutfit(payload, userId);
    return NextResponse.json(payload);
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unable to create outfit.",
    );
  }
}

export async function PATCH(request: Request) {
  const userId = getUserId(request);
  if (!userId) return jsonError("Missing user id.", 400);
  const payload = (await request.json()) as Outfit;
  try {
    await updateOutfit(payload, userId);
    return NextResponse.json(payload);
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unable to update outfit.",
    );
  }
}

export async function DELETE(request: Request) {
  const userId = getUserId(request);
  if (!userId) return jsonError("Missing user id.", 400);
  const payload = (await request.json()) as { id: string };
  try {
    await deleteOutfit(payload.id, userId);
    return NextResponse.json({ id: payload.id });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unable to delete outfit.",
    );
  }
}
