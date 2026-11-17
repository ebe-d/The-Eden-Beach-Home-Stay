import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { galleryImages } from "@/db/schema";
import { parsePositiveIntId, requireAdminApi } from "@/lib/api-helpers";
import { CACHE_TAGS } from "@/lib/data";
import { galleryImageSchema } from "@/lib/validation";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { id: rawId } = await context.params;
  const id = parsePositiveIntId(rawId);
  if (!id) {
    return NextResponse.json({ error: "Invalid image ID." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = galleryImageSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid update values." },
      { status: 400 }
    );
  }

  const db = getDb();
  const [updated] = await db
    .update(galleryImages)
    .set(parsed.data)
    .where(eq(galleryImages.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Gallery image not found." }, { status: 404 });
  }

  revalidateTag(CACHE_TAGS.gallery, { expire: 0 });
  return NextResponse.json({ image: updated });
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
    return NextResponse.json({ error: "Invalid image ID." }, { status: 400 });
  }

  const db = getDb();
  const [deleted] = await db
    .delete(galleryImages)
    .where(eq(galleryImages.id, id))
    .returning({ id: galleryImages.id });

  if (!deleted) {
    return NextResponse.json({ error: "Gallery image not found." }, { status: 404 });
  }

  revalidateTag(CACHE_TAGS.gallery, { expire: 0 });
  return NextResponse.json({ ok: true });
}

