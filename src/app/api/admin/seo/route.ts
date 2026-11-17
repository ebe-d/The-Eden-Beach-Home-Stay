import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { ensureCmsTablesExist } from "@/db/auto-migrate";
import { seoSettings } from "@/db/schema";
import { requireAdminApi } from "@/lib/api-helpers";
import { CACHE_TAGS, readSeoSettingsUncached } from "@/lib/data";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const seo = await readSeoSettingsUncached();
  return NextResponse.json({ seo });
}

export async function PUT(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const db = getDb();
    await ensureCmsTablesExist(db);

    const values = {
      metaTitle: body.metaTitle || "",
      metaDescription: body.metaDescription || "",
      keywords: body.keywords || "",
      ogTitle: body.ogTitle || "",
      ogDescription: body.ogDescription || "",
      ogImageUrl: body.ogImageUrl || "",
      canonicalUrl: body.canonicalUrl || "",
      updatedAt: new Date(),
    };

    const existing = await db
      .select({ id: seoSettings.id })
      .from(seoSettings)
      .where(eq(seoSettings.id, 1))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(seoSettings).values({ id: 1, ...values });
    } else {
      await db.update(seoSettings).set(values).where(eq(seoSettings.id, 1));
    }

    revalidateTag(CACHE_TAGS.seo, { expire: 0 });
    const updated = await readSeoSettingsUncached();

    return NextResponse.json({ success: true, seo: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update SEO settings.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
