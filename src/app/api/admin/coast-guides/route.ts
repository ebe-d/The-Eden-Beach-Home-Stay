import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { coastGuides } from "@/db/schema";
import { requireAdminApi } from "@/lib/api-helpers";
import { CACHE_TAGS, getAdminCoastGuides } from "@/lib/data";
import { coastGuideSchema } from "@/lib/validation";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const guides = await getAdminCoastGuides();
  return NextResponse.json({ guides });
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

  const parsed = coastGuideSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid coast guide entry." },
      { status: 400 }
    );
  }

  const db = getDb();
  const [created] = await db
    .insert(coastGuides)
    .values({ ...parsed.data, updatedAt: new Date() })
    .returning();

  revalidateTag(CACHE_TAGS.coastGuides, { expire: 0 });
  return NextResponse.json({ guide: created }, { status: 201 });
}

