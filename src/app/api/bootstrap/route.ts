import { NextResponse } from "next/server";
import { getUserId, jsonError } from "@/server/api/helpers";
import { fetchBootstrap } from "@/server/supabase/queries";

export async function GET(request: Request) {
  const userId = getUserId(request);
  if (!userId) {
    return jsonError("Missing user id.", 400);
  }

  try {
    const data = await fetchBootstrap(userId);
    return NextResponse.json(data);
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Unable to load data.",
    );
  }
}
