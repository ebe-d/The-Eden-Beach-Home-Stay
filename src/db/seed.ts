import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import { count, eq } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "./index";
import {
  DEFAULT_COAST_GUIDES,
  DEFAULT_GALLERY_IMAGES,
  DEFAULT_SITE_SETTINGS,
} from "./defaults";
import {
  adminUsers,
  coastGuides,
  galleryImages,
  siteSettings,
} from "./schema";
import { hashPasswordScrypt, isValidScryptHash } from "../lib/auth";

async function seed() {
  if (!isDatabaseConfigured()) {
    console.error("DATABASE_URL is not set. Please set it in .env.local or environment.");
    process.exit(1);
  }

  const db = getDb();

  // 1. Site settings (single row id = 1)
  const existingSettings = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, 1))
    .limit(1);

  if (existingSettings.length === 0) {
    await db.insert(siteSettings).values({
      id: 1,
      businessName: DEFAULT_SITE_SETTINGS.businessName,
      whatsappNumber: DEFAULT_SITE_SETTINGS.whatsappNumber,
      contactPhone: DEFAULT_SITE_SETTINGS.contactPhone,
      contactEmail: DEFAULT_SITE_SETTINGS.contactEmail,
      addressLine: DEFAULT_SITE_SETTINGS.addressLine,
      mapLinkUrl: DEFAULT_SITE_SETTINGS.mapLinkUrl,
      checkInNote: DEFAULT_SITE_SETTINGS.checkInNote,
      bookingDisclaimer: DEFAULT_SITE_SETTINGS.bookingDisclaimer,
      facilitiesJson: DEFAULT_SITE_SETTINGS.facilities,
      packagesJson: DEFAULT_SITE_SETTINGS.packages,
      beveragesNote: DEFAULT_SITE_SETTINGS.beveragesNote,
    });
    console.log("Seeded site_settings (row 1).");
  } else {
    console.log("site_settings already exists; skipped.");
  }

  // 2. Gallery images
  const [{ value: galleryCount }] = await db
    .select({ value: count() })
    .from(galleryImages);

  if (galleryCount === 0) {
    await db.insert(galleryImages).values(
      DEFAULT_GALLERY_IMAGES.map((item) => ({
        title: item.title,
        caption: item.caption,
        category: item.category,
        imageUrl: item.imageUrl,
        isStockPlaceholder: item.isStockPlaceholder,
        sortOrder: item.sortOrder,
        isVisible: item.isVisible,
      }))
    );
    console.log(`Seeded ${DEFAULT_GALLERY_IMAGES.length} gallery_images.`);
  } else {
    console.log("gallery_images already populated; skipped.");
  }

  // 3. Coast guide entries
  const [{ value: guideCount }] = await db
    .select({ value: count() })
    .from(coastGuides);

  if (guideCount === 0) {
    await db.insert(coastGuides).values(
      DEFAULT_COAST_GUIDES.map((spot) => ({
        destination: spot.destination,
        spotName: spot.spotName,
        shortDescription: spot.shortDescription,
        visitorNotes: spot.visitorNotes,
        mapUrl: spot.mapUrl,
        imageUrl: spot.imageUrl,
        sortOrder: spot.sortOrder,
        isVisible: spot.isVisible,
      }))
    );
    console.log(`Seeded ${DEFAULT_COAST_GUIDES.length} coast_guides.`);
  } else {
    console.log("coast_guides already populated; skipped.");
  }

  // 4. Optional admin user from environment variables
  const username = process.env.ADMIN_USERNAME?.trim().toLowerCase();
  const rawPassword = process.env.ADMIN_PASSWORD;
  const existingHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  const validHash = existingHash && isValidScryptHash(existingHash) ? existingHash : null;

  if (username && (validHash || (rawPassword && rawPassword.length > 0))) {
    const existingAdmin = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username))
      .limit(1);

    if (existingAdmin.length === 0) {
      await db.insert(adminUsers).values({
        username,
        passwordHash: validHash || hashPasswordScrypt(rawPassword!),
      });
      console.log(`Seeded admin user "${username}".`);
    }
  }

  console.log("Database seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

