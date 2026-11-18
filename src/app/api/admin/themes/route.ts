import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { ensureCmsTablesExist } from "@/db/auto-migrate";
import { themes } from "@/db/schema";
import { requireAdminApi } from "@/lib/api-helpers";
import {
  CACHE_TAGS,
  readThemesUncached,
  readThemeSettingsUncached,
} from "@/lib/data";
import { themeItemSchema } from "@/lib/validation";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const [themesList, settings] = await Promise.all([
    readThemesUncached(),
    readThemeSettingsUncached(),
  ]);

  return NextResponse.json({
    themes: themesList,
    settings,
  });
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

  const parsed = themeItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid theme configuration." },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const db = getDb();
  await ensureCmsTablesExist(db);

  // Check if theme with same id exists
  const existing = await db
    .select({ id: themes.id })
    .from(themes)
    .where(eq(themes.id, data.id))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json(
      { error: "A theme with this identifier already exists. Try another name or ID." },
      { status: 409 }
    );
  }

  await db.insert(themes).values({
    id: data.id,
    name: data.name,
    description: data.description,
    category: data.category,
    colorsJson: data.colors,
    typographyJson: data.typography,
    buttonStyleJson: data.buttonStyle,
    decorationsJson: data.decorations,
    isCustom: true,
  });

  revalidateTag(CACHE_TAGS.theme, { expire: 0 });
  const allThemes = await readThemesUncached();
  return NextResponse.json({ theme: data, themes: allThemes }, { status: 201 });
}
