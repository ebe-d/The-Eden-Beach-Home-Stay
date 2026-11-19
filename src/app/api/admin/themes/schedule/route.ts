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
  readThemeSettingsUncached,
} from "@/lib/data";
import { themeSettingsUpdateSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = themeSettingsUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid schedule settings." },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const db = getDb();
  await ensureCmsTablesExist(db);
  const existing = await db
    .select({ id: themeSettings.id })
    .from(themeSettings)
    .where(eq(themeSettings.id, 1))
    .limit(1);

  const values = {
    activeThemeId: data.activeThemeId,
    manualOverride: data.manualOverride,
    scheduledThemeId: data.scheduledThemeId || null,
    scheduleStartDate: data.scheduleStartDate || null,
    scheduleEndDate: data.scheduleEndDate || null,
    returnToThemeId: data.returnToThemeId || "default",
    updatedAt: new Date(),
  };

  if (existing.length === 0) {
    await db.insert(themeSettings).values({ id: 1, ...values });
  } else {
    await db.update(themeSettings).set(values).where(eq(themeSettings.id, 1));
  }

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
    message: "Theme schedule settings saved successfully.",
  });
}
