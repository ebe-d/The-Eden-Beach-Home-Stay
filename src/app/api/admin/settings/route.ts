import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { siteSettings } from "@/db/schema";
import { requireAdminApi } from "@/lib/api-helpers";
import { CACHE_TAGS, readSiteSettingsUncached } from "@/lib/data";
import { settingsUpdateSchema } from "@/lib/validation";
import { normalizeWhatsappNumber } from "@/lib/whatsapp";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const settings = await readSiteSettingsUncached();
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = settingsUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid settings values." },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const cleanWhatsapp = data.whatsappNumber
    ? normalizeWhatsappNumber(data.whatsappNumber)
    : "";

  const db = getDb();
  const existing = await db
    .select({ id: siteSettings.id })
    .from(siteSettings)
    .where(eq(siteSettings.id, 1))
    .limit(1);

  const values = {
    businessName: data.businessName,
    whatsappNumber: cleanWhatsapp,
    contactPhone: data.contactPhone,
    contactEmail: data.contactEmail,
    addressLine: data.addressLine,
    mapLinkUrl: data.mapLinkUrl,
    checkInNote: data.checkInNote,
    bookingDisclaimer: data.bookingDisclaimer,
    facilitiesJson: data.facilities,
    packagesJson: data.packages,
    beveragesNote: data.beveragesNote,
    updatedAt: new Date(),
  };

  if (existing.length === 0) {
    await db.insert(siteSettings).values({ id: 1, ...values });
  } else {
    await db.update(siteSettings).set(values).where(eq(siteSettings.id, 1));
  }

  revalidateTag(CACHE_TAGS.settings, { expire: 0 });
  const settings = await readSiteSettingsUncached();
  return NextResponse.json({ settings });
}

