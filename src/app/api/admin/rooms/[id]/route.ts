import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { ensureCmsTablesExist } from "@/db/auto-migrate";
import { rooms } from "@/db/schema";
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
    return NextResponse.json({ error: "Invalid room ID." }, { status: 400 });
  }

  try {
    const body = await request.json();
    const db = getDb();
    await ensureCmsTablesExist(db);

    const updates: Partial<typeof rooms.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (typeof body.name === "string") updates.name = body.name;
    if (typeof body.slug === "string") updates.slug = body.slug;
    if (typeof body.shortDescription === "string") updates.shortDescription = body.shortDescription;
    if (typeof body.fullDescription === "string") updates.fullDescription = body.fullDescription;
    if (typeof body.capacityGuests === "number") updates.capacityGuests = body.capacityGuests;
    if (typeof body.bedInfo === "string") updates.bedInfo = body.bedInfo;
    if (typeof body.pricingNote === "string") updates.pricingNote = body.pricingNote;
    if (typeof body.imageUrl === "string") updates.imageUrl = body.imageUrl;
    if (Array.isArray(body.galleryImages)) updates.galleryImagesJson = body.galleryImages;
    if (Array.isArray(body.facilities)) updates.facilitiesJson = body.facilities;
    if (typeof body.isFeatured === "boolean") updates.isFeatured = body.isFeatured;
    if (typeof body.isVisible === "boolean") updates.isVisible = body.isVisible;
    if (typeof body.sortOrder === "number") updates.sortOrder = body.sortOrder;

    const [updated] = await db
      .update(rooms)
      .set(updates)
      .where(eq(rooms.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Room not found." }, { status: 404 });
    }

    revalidateTag(CACHE_TAGS.rooms, { expire: 0 });

    return NextResponse.json({
      room: {
        id: updated.id,
        name: updated.name,
        slug: updated.slug,
        shortDescription: updated.shortDescription,
        fullDescription: updated.fullDescription,
        capacityGuests: updated.capacityGuests,
        bedInfo: updated.bedInfo,
        pricingNote: updated.pricingNote,
        imageUrl: updated.imageUrl,
        galleryImages: updated.galleryImagesJson || [],
        facilities: updated.facilitiesJson || [],
        isFeatured: updated.isFeatured,
        isVisible: updated.isVisible,
        sortOrder: updated.sortOrder,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update room.";
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
    return NextResponse.json({ error: "Invalid room ID." }, { status: 400 });
  }

  try {
    const db = getDb();
    await ensureCmsTablesExist(db);

    const [existing] = await db
      .select({ id: rooms.id })
      .from(rooms)
      .where(eq(rooms.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Room not found." }, { status: 404 });
    }

    await db.delete(rooms).where(eq(rooms.id, id));
    revalidateTag(CACHE_TAGS.rooms, { expire: 0 });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete room.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
