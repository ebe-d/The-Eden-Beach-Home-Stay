import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/db";
import { getAdminSession } from "./auth";

export function dbNotConfiguredResponse() {
  return NextResponse.json(
    {
      error:
        "PostgreSQL database is not configured yet. Please set DATABASE_URL and run database migrations.",
    },
    { status: 503 }
  );
}

export async function requireAdminApi(): Promise<
  | { ok: true; username: string }
  | { ok: false; response: NextResponse }
> {
  const session = await getAdminSession();
  if (!session.authenticated || !session.username) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Unauthorized. Please sign in as the property owner." },
        { status: 401 }
      ),
    };
  }
  if (!isDatabaseConfigured()) {
    return {
      ok: false,
      response: dbNotConfiguredResponse(),
    };
  }
  return { ok: true, username: session.username };
}

export function parsePositiveIntId(raw: string): number | null {
  const num = Number(raw);
  if (!Number.isInteger(num) || num <= 0) return null;
  return num;
}

