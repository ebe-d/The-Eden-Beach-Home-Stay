import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/api-helpers";
import { CACHE_TAGS } from "@/lib/data";

export async function POST() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  // Flush all public cache tags so live website immediately reflects latest edits
  revalidateTag(CACHE_TAGS.homepage, { expire: 0 });
  revalidateTag(CACHE_TAGS.rooms, { expire: 0 });
  revalidateTag(CACHE_TAGS.gallery, { expire: 0 });
  revalidateTag(CACHE_TAGS.coastGuides, { expire: 0 });
  revalidateTag(CACHE_TAGS.settings, { expire: 0 });
  revalidateTag(CACHE_TAGS.availability, { expire: 0 });
  revalidateTag(CACHE_TAGS.about, { expire: 0 });
  revalidateTag(CACHE_TAGS.seo, { expire: 0 });
  revalidateTag(CACHE_TAGS.media, { expire: 0 });

  return NextResponse.json({
    success: true,
    publishedAt: new Date().toISOString(),
    message: "Public website content successfully published and refreshed.",
  });
}
