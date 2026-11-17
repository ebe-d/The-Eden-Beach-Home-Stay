import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { availabilityBlocks } from "@/db/schema";
import { requireAdminApi } from "@/lib/api-helpers";
import { CACHE_TAGS, readAvailabilityBlocksUncached } from "@/lib/data";
import { availabilityBlockSchema } from "@/lib/validation";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const blocks = await readAvailabilityBlocksUncached();
  return NextResponse.json({ blocks });
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = availabilityBlockSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid date range." },
      { status: 400 }
    );
  }

  const db = getDb();
  const [created] = await db
    .insert(availabilityBlocks)
    .values(parsed.data)
    .returning();

  revalidateTag(CACHE_TAGS.availability, { expire: 0 });
  return NextResponse.json({ block: created }, { status: 201 });
}

