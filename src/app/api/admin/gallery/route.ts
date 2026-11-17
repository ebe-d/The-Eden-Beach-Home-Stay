import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { galleryImages } from "@/db/schema";
import { requireAdminApi } from "@/lib/api-helpers";
import { CACHE_TAGS, getAdminGalleryImages } from "@/lib/data";
import { galleryImageSchema } from "@/lib/validation";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const images = await getAdminGalleryImages();
  return NextResponse.json({ images });
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

  const parsed = galleryImageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid gallery item." },
      { status: 400 }
    );
  }

  const db = getDb();
  const [created] = await db
    .insert(galleryImages)
    .values(parsed.data)
    .returning();

  revalidateTag(CACHE_TAGS.gallery, { expire: 0 });
  return NextResponse.json({ image: created }, { status: 201 });
}

