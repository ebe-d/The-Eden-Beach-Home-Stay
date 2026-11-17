import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { ensureCmsTablesExist } from "@/db/auto-migrate";
import { aboutContent } from "@/db/schema";
import { requireAdminApi } from "@/lib/api-helpers";
import { CACHE_TAGS, readAboutContentUncached } from "@/lib/data";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const content = await readAboutContentUncached();
  return NextResponse.json({ about: content });
}

export async function PUT(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const db = getDb();
    await ensureCmsTablesExist(db);

    const values = {
      heading: body.heading || "",
      intro: body.intro || "",
      fullDescription: body.fullDescription || "",
      imagesJson: Array.isArray(body.images) ? body.images : [],
      highlightsJson: Array.isArray(body.highlights) ? body.highlights : [],
      updatedAt: new Date(),
    };

    const existing = await db
      .select({ id: aboutContent.id })
      .from(aboutContent)
      .where(eq(aboutContent.id, 1))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(aboutContent).values({ id: 1, ...values });
    } else {
      await db.update(aboutContent).set(values).where(eq(aboutContent.id, 1));
    }

    revalidateTag(CACHE_TAGS.about, { expire: 0 });
    const updated = await readAboutContentUncached();

    return NextResponse.json({ success: true, about: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update about content.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
