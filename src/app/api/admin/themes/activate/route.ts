import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { ensureCmsTablesExist } from "@/db/auto-migrate";
import { themeSettings } from "@/db/schema";
import { requireAdminApi } from "@/lib/api-helpers";
import {
  CACHE_TAGS,
  getActiveThemeConfig,
  readThemesUncached,
  readThemeSettingsUncached,
} from "@/lib/data";

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  let body: { themeId?: string; resetToDefault?: boolean } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const targetThemeId = body.resetToDefault ? "default" : body.themeId?.trim();
  if (!targetThemeId) {
    return NextResponse.json({ error: "Theme ID is required." }, { status: 400 });
  }

  // Verify theme exists
  const allThemes = await readThemesUncached();
  const found = allThemes.find((t) => t.id === targetThemeId);
  if (!found) {
    return NextResponse.json(
      { error: `Theme "${targetThemeId}" was not found.` },
      { status: 404 }
    );
  }

  const db = getDb();
  await ensureCmsTablesExist(db);
  const existing = await db
    .select({ id: themeSettings.id })
    .from(themeSettings)
    .where(eq(themeSettings.id, 1))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(themeSettings).values({
      id: 1,
      activeThemeId: targetThemeId,
      manualOverride: true,
      updatedAt: new Date(),
    });
  } else {
    await db
      .update(themeSettings)
      .set({
        activeThemeId: targetThemeId,
        manualOverride: true,
        updatedAt: new Date(),
      })
      .where(eq(themeSettings.id, 1));
  }

  // Invalidate cache immediately so public pages receive new theme on next request
  revalidateTag(CACHE_TAGS.theme, { expire: 0 });
  try {
    revalidatePath("/", "layout");
  } catch {}

  const updatedSettings = await readThemeSettingsUncached();
  const activeTheme = await getActiveThemeConfig();

  return NextResponse.json({
    success: true,
    settings: updatedSettings,
    activeTheme,
    message: `Theme "${found.name}" successfully activated on the live website!`,
  });
}
