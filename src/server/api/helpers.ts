import { NextResponse } from "next/server";

export const getUserId = (request: Request) => {
  const headerId = request.headers.get("x-user-id");
  if (headerId) return headerId;
  const url = new URL(request.url);
  return url.searchParams.get("userId");
};

export const jsonError = (message: string, status = 500) =>
  NextResponse.json({ error: message }, { status });
