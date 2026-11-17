import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import fs from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { mediaItems } from "@/db/schema";
import { parsePositiveIntId, requireAdminApi } from "@/lib/api-helpers";
import { CACHE_TAGS } from "@/lib/data";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { id: rawId } = await context.params;
  const id = parsePositiveIntId(rawId);
  if (!id) {
    return NextResponse.json({ error: "Invalid media ID." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const db = getDb();

    const [existing] = await db
      .select()
      .from(mediaItems)
      .where(eq(mediaItems.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Media item not found." }, { status: 404 });
    }

    const updates: Partial<typeof mediaItems.$inferInsert> = {};
    if (typeof body.title === "string") updates.title = body.title;
    if (typeof body.caption === "string") updates.caption = body.caption;
    if (typeof body.altText === "string") updates.altText = body.altText;
    if (typeof body.category === "string") updates.category = body.category;
    if (typeof body.isFeaturedHomepage === "boolean") updates.isFeaturedHomepage = body.isFeaturedHomepage;
    if (typeof body.sortOrder === "number") updates.sortOrder = body.sortOrder;

    const [updated] = await db
      .update(mediaItems)
      .set(updates)
      .where(eq(mediaItems.id, id))
      .returning();

    revalidateTag(CACHE_TAGS.media, { expire: 0 });

    return NextResponse.json({
      item: {
        ...updated,
        createdAt: updated.createdAt.toISOString(),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update media item.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { id: rawId } = await context.params;
  const id = parsePositiveIntId(rawId);
  if (!id) {
    return NextResponse.json({ error: "Invalid media ID." }, { status: 400 });
  }

  try {
    const db = getDb();
    const [existing] = await db
      .select()
      .from(mediaItems)
      .where(eq(mediaItems.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Media item not found." }, { status: 404 });
    }

    await db.delete(mediaItems).where(eq(mediaItems.id, id));

    // If locally stored in public/uploads, safely clean up disk file
    if (existing.storageType === "local" && existing.url.startsWith("/uploads/")) {
      try {
        const filePath = path.join(process.cwd(), "public", existing.url);
        await fs.unlink(filePath);
      } catch {
        // Safe to ignore if file was already moved or removed
      }
    }

    revalidateTag(CACHE_TAGS.media, { expire: 0 });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete media item.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
