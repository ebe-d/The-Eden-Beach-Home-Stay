import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { availabilityBlocks } from "@/db/schema";
import { parsePositiveIntId, requireAdminApi } from "@/lib/api-helpers";
import { CACHE_TAGS } from "@/lib/data";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { id: rawId } = await context.params;
  const id = parsePositiveIntId(rawId);
  if (!id) {
    return NextResponse.json({ error: "Invalid block ID." }, { status: 400 });
  }

  const db = getDb();
  const [deleted] = await db
    .delete(availabilityBlocks)
    .where(eq(availabilityBlocks.id, id))
    .returning({ id: availabilityBlocks.id });

  if (!deleted) {
    return NextResponse.json({ error: "Availability block not found." }, { status: 404 });
  }

  revalidateTag(CACHE_TAGS.availability, { expire: 0 });
  return NextResponse.json({ ok: true });
}

