import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { asc } from "drizzle-orm";
import { getDb } from "@/db";
import { ensureCmsTablesExist } from "@/db/auto-migrate";
import { rooms } from "@/db/schema";
import { requireAdminApi } from "@/lib/api-helpers";
import { CACHE_TAGS, readRoomsUncached } from "@/lib/data";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const roomList = await readRoomsUncached();
  return NextResponse.json({ rooms: roomList });
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const db = getDb();
    await ensureCmsTablesExist(db);

    const slug =
      (body.slug || body.name || "room")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || `room-${Date.now()}`;

    const [inserted] = await db
      .insert(rooms)
      .values({
        name: body.name || "New Beachfront Room",
        slug,
        shortDescription: body.shortDescription || "Comfortable beachfront sanctuary.",
        fullDescription: body.fullDescription || "",
        capacityGuests: Number(body.capacityGuests) || 4,
        bedInfo: body.bedInfo || "2 Main Beds + 2 Optional Add-on Beds",
        pricingNote: body.pricingNote || "Prices provided upon enquiry",
        imageUrl: body.imageUrl || "https://images.unsplash.com/photo-1779870458288-95fd59cd2c5b?auto=format&fit=crop&w=1400&q=80",
        galleryImagesJson: Array.isArray(body.galleryImages) ? body.galleryImages : [],
        facilitiesJson: Array.isArray(body.facilities) ? body.facilities : [],
        isFeatured: typeof body.isFeatured === "boolean" ? body.isFeatured : true,
        isVisible: typeof body.isVisible === "boolean" ? body.isVisible : true,
        sortOrder: Number(body.sortOrder) || 1,
      })
      .returning();

    revalidateTag(CACHE_TAGS.rooms, { expire: 0 });

    return NextResponse.json({
      room: {
        id: inserted.id,
        name: inserted.name,
        slug: inserted.slug,
        shortDescription: inserted.shortDescription,
        fullDescription: inserted.fullDescription,
        capacityGuests: inserted.capacityGuests,
        bedInfo: inserted.bedInfo,
        pricingNote: inserted.pricingNote,
        imageUrl: inserted.imageUrl,
        galleryImages: inserted.galleryImagesJson || [],
        facilities: inserted.facilitiesJson || [],
        isFeatured: inserted.isFeatured,
        isVisible: inserted.isVisible,
        sortOrder: inserted.sortOrder,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create room.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
