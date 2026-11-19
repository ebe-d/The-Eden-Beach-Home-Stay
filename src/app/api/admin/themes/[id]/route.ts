import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { ensureCmsTablesExist } from "@/db/auto-migrate";
import { themes } from "@/db/schema";
import { DEFAULT_THEMES } from "@/db/defaults";
import { requireAdminApi } from "@/lib/api-helpers";
import {
  CACHE_TAGS,
  readThemesUncached,
  readThemeSettingsUncached,
} from "@/lib/data";
import { themeItemSchema } from "@/lib/validation";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { id } = await params;
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

  const isPreset = DEFAULT_THEMES.some((t) => t.id === id);

  const existing = await db
    .select({ id: themes.id })
    .from(themes)
    .where(eq(themes.id, id))
    .limit(1);

  if (existing.length === 0) {
    // Insert new record (either custom theme or preset customization)
    await db.insert(themes).values({
      id,
      name: data.name,
      description: data.description,
      category: data.category,
      colorsJson: data.colors,
      typographyJson: data.typography,
      buttonStyleJson: data.buttonStyle,
      decorationsJson: data.decorations,
      isCustom: !isPreset,
      updatedAt: new Date(),
    });
  } else {
    // Update existing record
    await db
      .update(themes)
      .set({
        name: data.name,
        description: data.description,
        category: data.category,
        colorsJson: data.colors,
        typographyJson: data.typography,
        buttonStyleJson: data.buttonStyle,
        decorationsJson: data.decorations,
        updatedAt: new Date(),
      })
      .where(eq(themes.id, id));
  }

  revalidateTag(CACHE_TAGS.theme, { expire: 0 });
  try {
    revalidatePath("/", "layout");
  } catch {}
  const allThemes = await readThemesUncached();
  return NextResponse.json({ theme: data, themes: allThemes });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { id } = await params;

  // Protect presets from deletion
  const isPreset = DEFAULT_THEMES.some((t) => t.id === id);
  if (isPreset) {
    return NextResponse.json(
      { error: "Preset festival and seasonal themes cannot be deleted. You can edit them or reset to default." },
      { status: 400 }
    );
  }

  // Prevent deleting currently active theme
  const settings = await readThemeSettingsUncached();
  if (settings.activeThemeId === id) {
    return NextResponse.json(
      { error: "Cannot delete the currently active theme. Please activate another theme first." },
      { status: 400 }
    );
  }

  const db = getDb();
  await ensureCmsTablesExist(db);
  await db.delete(themes).where(eq(themes.id, id));

  revalidateTag(CACHE_TAGS.theme, { expire: 0 });
  try {
    revalidatePath("/", "layout");
  } catch {}
  const allThemes = await readThemesUncached();
  return NextResponse.json({ success: true, themes: allThemes });
}
