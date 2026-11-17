import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { ensureCmsTablesExist } from "@/db/auto-migrate";
import { homepageContent } from "@/db/schema";
import { requireAdminApi } from "@/lib/api-helpers";
import { CACHE_TAGS, readHomepageContentUncached } from "@/lib/data";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const content = await readHomepageContentUncached();
  return NextResponse.json({ content });
}

export async function PUT(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const db = getDb();
    await ensureCmsTablesExist(db);

    const values = {
      heroTitle: body.heroTitle,
      heroSubtitle: body.heroSubtitle,
      heroImageUrl: body.heroImageUrl,
      heroSlidesJson: Array.isArray(body.heroSlides) ? body.heroSlides : [],
      welcomeHeading: body.welcomeHeading,
      welcomeText: body.welcomeText,
      welcomeImagesJson: Array.isArray(body.welcomeImages) ? body.welcomeImages : [],
      experiencesJson: Array.isArray(body.experiences) ? body.experiences : [],
      sectionsVisibilityJson: body.sectionsVisibility || {
        hero: true,
        welcome: true,
        rooms: true,
        facilities: true,
        experiences: true,
        gallery: true,
        coast: true,
        enquiry: true,
      },
      isPublished: typeof body.isPublished === "boolean" ? body.isPublished : true,
      updatedAt: new Date(),
    };

    const existing = await db
      .select({ id: homepageContent.id })
      .from(homepageContent)
      .where(eq(homepageContent.id, 1))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(homepageContent).values({ id: 1, ...values });
    } else {
      await db.update(homepageContent).set(values).where(eq(homepageContent.id, 1));
    }

    revalidateTag(CACHE_TAGS.homepage, { expire: 0 });
    const content = await readHomepageContentUncached();

    return NextResponse.json({ success: true, content });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update homepage content.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
