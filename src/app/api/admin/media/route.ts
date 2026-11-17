import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { mediaItems } from "@/db/schema";
import { requireAdminApi } from "@/lib/api-helpers";
import { CACHE_TAGS, readMediaItemsUncached } from "@/lib/data";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const items = await readMediaItemsUncached();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const { title, url, category = "General", altText = "", caption = "" } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Image URL is required." }, { status: 400 });
    }

    const db = getDb();
    const [inserted] = await db
      .insert(mediaItems)
      .values({
        title: title || "New Image",
        altText: altText || title || "Image",
        caption: caption || "",
        url: url.trim(),
        storageType: "external",
        publicId: "",
        category,
        fileSize: 0,
        mimeType: "image/jpeg",
        sortOrder: 0,
      })
      .returning();

    revalidateTag(CACHE_TAGS.media, { expire: 0 });

    return NextResponse.json({
      item: {
        ...inserted,
        createdAt: inserted.createdAt.toISOString(),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to add media item.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
