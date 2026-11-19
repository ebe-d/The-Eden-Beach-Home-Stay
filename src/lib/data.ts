import { cacheLife, cacheTag } from "next/cache";
import { asc, desc, eq } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db";
import { ensureCmsTablesExist } from "@/db/auto-migrate";
import {
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_COAST_GUIDES,
  DEFAULT_GALLERY_IMAGES,
  DEFAULT_HOMEPAGE_CONTENT,
  DEFAULT_ROOMS,
  DEFAULT_SEO_SETTINGS,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_THEMES,
  DEFAULT_THEME_SETTINGS,
  type PublicAboutContent,
  type PublicAvailabilityBlock,
  type PublicCoastGuideSpot,
  type PublicGalleryImage,
  type PublicHomepageContent,
  type PublicMediaItem,
  type PublicRoomItem,
  type PublicSeoSettings,
  type PublicSiteSettings,
  type PublicThemeItem,
  type PublicThemeSettings,
} from "@/db/defaults";
import {
  aboutContent,
  availabilityBlocks,
  coastGuides,
  enquiries,
  galleryImages,
  homepageContent,
  mediaItems,
  rooms,
  seoSettings,
  siteSettings,
  themeSettings,
  themes,
  type CoastDestination,
  type GalleryCategory,
} from "@/db/schema";
import { resolveEffectiveThemeId } from "./theme-utils";

export const CACHE_TAGS = {
  settings: "site-settings",
  gallery: "gallery",
  coastGuides: "coast-guides",
  availability: "availability",
  homepage: "homepage",
  rooms: "rooms",
  about: "about",
  seo: "seo",
  media: "media",
  theme: "theme",
} as const;

export async function getSiteSettings(): Promise<PublicSiteSettings> {
  "use cache";
  cacheTag(CACHE_TAGS.settings);
  cacheLife("minutes");

  return readSiteSettingsUncached();
}

export async function readSiteSettingsUncached(): Promise<PublicSiteSettings> {
  if (!isDatabaseConfigured()) {
    return DEFAULT_SITE_SETTINGS;
  }

  try {
    const db = getDb();
    const [row] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.id, 1))
      .limit(1);

    if (!row) {
      return DEFAULT_SITE_SETTINGS;
    }

    return {
      businessName: row.businessName,
      whatsappNumber: row.whatsappNumber,
      contactPhone: row.contactPhone,
      contactEmail: row.contactEmail,
      addressLine: row.addressLine,
      mapLinkUrl: row.mapLinkUrl,
      checkInNote: row.checkInNote,
      bookingDisclaimer: row.bookingDisclaimer,
      facilities:
        Array.isArray(row.facilitiesJson) && row.facilitiesJson.length > 0
          ? row.facilitiesJson
          : DEFAULT_SITE_SETTINGS.facilities,
      packages:
        Array.isArray(row.packagesJson) && row.packagesJson.length > 0
          ? row.packagesJson
          : DEFAULT_SITE_SETTINGS.packages,
      beveragesNote: row.beveragesNote,
    };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function getGalleryImages(): Promise<PublicGalleryImage[]> {
  "use cache";
  cacheTag(CACHE_TAGS.gallery);
  cacheLife("minutes");

  if (!isDatabaseConfigured()) {
    return DEFAULT_GALLERY_IMAGES;
  }

  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.isVisible, true))
      .orderBy(asc(galleryImages.sortOrder), asc(galleryImages.id));

    let mediaRows: Array<typeof mediaItems.$inferSelect> = [];
    try {
      mediaRows = await db
        .select()
        .from(mediaItems)
        .orderBy(asc(mediaItems.sortOrder), desc(mediaItems.id));
    } catch {
      // Table may not exist yet
    }

    if (rows.length === 0 && mediaRows.length === 0) {
      return DEFAULT_GALLERY_IMAGES;
    }

    const combined: PublicGalleryImage[] = (
      rows.length > 0 ? rows : DEFAULT_GALLERY_IMAGES
    ).map((row) => ({
      id: row.id,
      title: row.title,
      caption: row.caption,
      category: row.category as GalleryCategory,
      imageUrl: row.imageUrl,
      isStockPlaceholder: row.isStockPlaceholder,
      sortOrder: row.sortOrder,
      isVisible: row.isVisible,
    }));

    for (const m of mediaRows) {
      combined.unshift({
        id: m.id + 10000,
        title: m.title,
        caption: m.caption,
        category: (m.category as GalleryCategory) || "Property",
        imageUrl: m.url,
        isStockPlaceholder: false,
        sortOrder: m.sortOrder,
        isVisible: true,
      });
    }

    return combined;
  } catch {
    return DEFAULT_GALLERY_IMAGES;
  }
}

export async function getAdminGalleryImages(): Promise<PublicGalleryImage[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  const db = getDb();
  const rows = await db
    .select()
    .from(galleryImages)
    .orderBy(asc(galleryImages.sortOrder), asc(galleryImages.id));

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    caption: row.caption,
    category: row.category as GalleryCategory,
    imageUrl: row.imageUrl,
    isStockPlaceholder: row.isStockPlaceholder,
    sortOrder: row.sortOrder,
    isVisible: row.isVisible,
  }));
}

export async function getCoastGuides(): Promise<PublicCoastGuideSpot[]> {
  "use cache";
  cacheTag(CACHE_TAGS.coastGuides);
  cacheLife("minutes");

  if (!isDatabaseConfigured()) {
    return DEFAULT_COAST_GUIDES;
  }

  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(coastGuides)
      .where(eq(coastGuides.isVisible, true))
      .orderBy(asc(coastGuides.sortOrder), asc(coastGuides.id));

    if (rows.length === 0) {
      return DEFAULT_COAST_GUIDES;
    }

    const defaultMap = new Map(
      DEFAULT_COAST_GUIDES.map((d) => [d.spotName.toLowerCase().trim(), d])
    );

    const enriched: PublicCoastGuideSpot[] = rows.map((row) => {
      const match = defaultMap.get(row.spotName.toLowerCase().trim());
      return {
        id: row.id,
        destination: row.destination as CoastDestination,
        spotName: row.spotName,
        shortDescription: row.shortDescription,
        visitorNotes: row.visitorNotes,
        mapUrl: row.mapUrl,
        imageUrl: row.imageUrl,
        sortOrder: row.sortOrder,
        isVisible: row.isVisible,
        categoryBadge: match?.categoryBadge,
        interestingFacts: match?.interestingFacts,
        distanceFromHomestay: match?.distanceFromHomestay,
        locationArea: match?.locationArea,
      };
    });

    const existingNames = new Set(
      rows.map((r) => r.spotName.toLowerCase().trim())
    );
    for (const defSpot of DEFAULT_COAST_GUIDES) {
      if (!existingNames.has(defSpot.spotName.toLowerCase().trim())) {
        enriched.push(defSpot);
      }
    }

    return enriched.sort((a, b) => a.sortOrder - b.sortOrder);
  } catch {
    return DEFAULT_COAST_GUIDES;
  }
}

export async function getAdminCoastGuides(): Promise<PublicCoastGuideSpot[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  const db = getDb();
  const rows = await db
    .select()
    .from(coastGuides)
    .orderBy(asc(coastGuides.sortOrder), asc(coastGuides.id));

  return rows.map((row) => ({
    id: row.id,
    destination: row.destination as CoastDestination,
    spotName: row.spotName,
    shortDescription: row.shortDescription,
    visitorNotes: row.visitorNotes,
    mapUrl: row.mapUrl,
    imageUrl: row.imageUrl,
    sortOrder: row.sortOrder,
    isVisible: row.isVisible,
  }));
}

export async function getAvailabilityBlocks(): Promise<PublicAvailabilityBlock[]> {
  "use cache";
  cacheTag(CACHE_TAGS.availability);
  cacheLife("minutes");

  return readAvailabilityBlocksUncached();
}

export async function readAvailabilityBlocksUncached(): Promise<PublicAvailabilityBlock[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(availabilityBlocks)
      .orderBy(asc(availabilityBlocks.startDate), asc(availabilityBlocks.id));

    return rows.map((row) => ({
      id: row.id,
      startDate: row.startDate,
      endDate: row.endDate,
      status: row.status,
      note: row.note,
    }));
  } catch {
    return [];
  }
}

export async function getAdminEnquiries() {
  if (!isDatabaseConfigured()) {
    return [];
  }

  const db = getDb();
  return db.select().from(enquiries).orderBy(desc(enquiries.createdAt), desc(enquiries.id));
}

export async function getHomepageContent(): Promise<PublicHomepageContent> {
  "use cache";
  cacheTag(CACHE_TAGS.homepage);
  cacheLife("minutes");

  return readHomepageContentUncached();
}

export async function readHomepageContentUncached(): Promise<PublicHomepageContent> {
  if (!isDatabaseConfigured()) {
    return DEFAULT_HOMEPAGE_CONTENT;
  }

  try {
    const db = getDb();
    await ensureCmsTablesExist(db);
    const [row] = await db
      .select()
      .from(homepageContent)
      .where(eq(homepageContent.id, 1))
      .limit(1);

    if (!row) {
      return DEFAULT_HOMEPAGE_CONTENT;
    }

    return {
      heroTitle: row.heroTitle,
      heroSubtitle: row.heroSubtitle,
      heroImageUrl: row.heroImageUrl,
      heroSlides:
        Array.isArray(row.heroSlidesJson) && row.heroSlidesJson.length > 0
          ? row.heroSlidesJson
          : DEFAULT_HOMEPAGE_CONTENT.heroSlides,
      welcomeHeading: row.welcomeHeading,
      welcomeText: row.welcomeText,
      welcomeImages:
        Array.isArray(row.welcomeImagesJson) && row.welcomeImagesJson.length > 0
          ? row.welcomeImagesJson
          : DEFAULT_HOMEPAGE_CONTENT.welcomeImages,
      experiences:
        Array.isArray(row.experiencesJson) && row.experiencesJson.length > 0
          ? row.experiencesJson
          : DEFAULT_HOMEPAGE_CONTENT.experiences,
      sectionsVisibility: row.sectionsVisibilityJson || DEFAULT_HOMEPAGE_CONTENT.sectionsVisibility,
      isPublished: row.isPublished,
    };
  } catch {
    return DEFAULT_HOMEPAGE_CONTENT;
  }
}

export async function getRooms(): Promise<PublicRoomItem[]> {
  "use cache";
  cacheTag(CACHE_TAGS.rooms);
  cacheLife("minutes");

  return readRoomsUncached();
}

export async function readRoomsUncached(): Promise<PublicRoomItem[]> {
  if (!isDatabaseConfigured()) {
    return DEFAULT_ROOMS;
  }

  try {
    const db = getDb();
    await ensureCmsTablesExist(db);
    const rows = await db
      .select()
      .from(rooms)
      .where(eq(rooms.isVisible, true))
      .orderBy(asc(rooms.sortOrder), asc(rooms.id));

    if (rows.length === 0) {
      return DEFAULT_ROOMS;
    }

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      shortDescription: r.shortDescription,
      fullDescription: r.fullDescription,
      capacityGuests: r.capacityGuests,
      bedInfo: r.bedInfo,
      pricingNote: r.pricingNote,
      imageUrl: r.imageUrl,
      galleryImages: Array.isArray(r.galleryImagesJson) ? r.galleryImagesJson : [],
      facilities: Array.isArray(r.facilitiesJson) ? r.facilitiesJson : [],
      isFeatured: r.isFeatured,
      isVisible: r.isVisible,
      sortOrder: r.sortOrder,
    }));
  } catch {
    return DEFAULT_ROOMS;
  }
}

export async function getAdminRooms(): Promise<PublicRoomItem[]> {
  if (!isDatabaseConfigured()) {
    return DEFAULT_ROOMS;
  }

  try {
    const db = getDb();
    await ensureCmsTablesExist(db);
    const rows = await db
      .select()
      .from(rooms)
      .orderBy(asc(rooms.sortOrder), asc(rooms.id));

    if (rows.length === 0) {
      return DEFAULT_ROOMS;
    }

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      shortDescription: r.shortDescription,
      fullDescription: r.fullDescription,
      capacityGuests: r.capacityGuests,
      bedInfo: r.bedInfo,
      pricingNote: r.pricingNote,
      imageUrl: r.imageUrl,
      galleryImages: Array.isArray(r.galleryImagesJson) ? r.galleryImagesJson : [],
      facilities: Array.isArray(r.facilitiesJson) ? r.facilitiesJson : [],
      isFeatured: r.isFeatured,
      isVisible: r.isVisible,
      sortOrder: r.sortOrder,
    }));
  } catch {
    return DEFAULT_ROOMS;
  }
}

export async function getAboutContent(): Promise<PublicAboutContent> {
  "use cache";
  cacheTag(CACHE_TAGS.about);
  cacheLife("minutes");

  return readAboutContentUncached();
}

export async function readAboutContentUncached(): Promise<PublicAboutContent> {
  if (!isDatabaseConfigured()) {
    return DEFAULT_ABOUT_CONTENT;
  }

  try {
    const db = getDb();
    await ensureCmsTablesExist(db);
    const [row] = await db
      .select()
      .from(aboutContent)
      .where(eq(aboutContent.id, 1))
      .limit(1);

    if (!row) {
      return DEFAULT_ABOUT_CONTENT;
    }

    return {
      heading: row.heading,
      intro: row.intro,
      fullDescription: row.fullDescription,
      images: Array.isArray(row.imagesJson) && row.imagesJson.length > 0
        ? row.imagesJson
        : DEFAULT_ABOUT_CONTENT.images,
      highlights: Array.isArray(row.highlightsJson) && row.highlightsJson.length > 0
        ? row.highlightsJson
        : DEFAULT_ABOUT_CONTENT.highlights,
    };
  } catch {
    return DEFAULT_ABOUT_CONTENT;
  }
}

export async function getSeoSettings(): Promise<PublicSeoSettings> {
  "use cache";
  cacheTag(CACHE_TAGS.seo);
  cacheLife("minutes");

  return readSeoSettingsUncached();
}

export async function readSeoSettingsUncached(): Promise<PublicSeoSettings> {
  if (!isDatabaseConfigured()) {
    return DEFAULT_SEO_SETTINGS;
  }

  try {
    const db = getDb();
    await ensureCmsTablesExist(db);
    const [row] = await db
      .select()
      .from(seoSettings)
      .where(eq(seoSettings.id, 1))
      .limit(1);

    if (!row) {
      return DEFAULT_SEO_SETTINGS;
    }

    return {
      metaTitle: row.metaTitle,
      metaDescription: row.metaDescription,
      keywords: row.keywords,
      ogTitle: row.ogTitle,
      ogDescription: row.ogDescription,
      ogImageUrl: row.ogImageUrl,
      canonicalUrl: row.canonicalUrl,
    };
  } catch {
    return DEFAULT_SEO_SETTINGS;
  }
}

export async function getMediaItems(): Promise<PublicMediaItem[]> {
  "use cache";
  cacheTag(CACHE_TAGS.media);
  cacheLife("minutes");

  return readMediaItemsUncached();
}

export async function readMediaItemsUncached(): Promise<PublicMediaItem[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    const db = getDb();
    await ensureCmsTablesExist(db);
    const rows = await db
      .select()
      .from(mediaItems)
      .orderBy(desc(mediaItems.createdAt), desc(mediaItems.id));

    return rows.map((m) => ({
      id: m.id,
      title: m.title,
      caption: m.caption,
      altText: m.altText,
      url: m.url,
      storageType: m.storageType,
      publicId: m.publicId,
      category: m.category,
      isFeaturedHomepage: m.isFeaturedHomepage,
      sortOrder: m.sortOrder,
      fileSize: m.fileSize,
      mimeType: m.mimeType,
      createdAt: m.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function getThemes(): Promise<PublicThemeItem[]> {
  "use cache";
  cacheTag(CACHE_TAGS.theme);
  cacheLife("minutes");

  return readThemesUncached();
}

export async function readThemesUncached(): Promise<PublicThemeItem[]> {
  if (!isDatabaseConfigured()) {
    return DEFAULT_THEMES;
  }

  try {
    const db = getDb();
    await ensureCmsTablesExist(db);
    const rows = await db.select().from(themes);

    if (rows.length === 0) {
      return DEFAULT_THEMES;
    }

    const dbThemeMap = new Map<string, PublicThemeItem>();
    for (const r of rows) {
      dbThemeMap.set(r.id, {
        id: r.id,
        name: r.name,
        description: r.description,
        category: (r.category as PublicThemeItem["category"]) || "custom",
        colors: r.colorsJson,
        typography: r.typographyJson,
        buttonStyle: r.buttonStyleJson,
        decorations: r.decorationsJson,
        isCustom: r.isCustom,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      });
    }

    const combined: PublicThemeItem[] = [];
    for (const preset of DEFAULT_THEMES) {
      if (dbThemeMap.has(preset.id)) {
        combined.push(dbThemeMap.get(preset.id)!);
        dbThemeMap.delete(preset.id);
      } else {
        combined.push(preset);
      }
    }

    for (const customTheme of dbThemeMap.values()) {
      combined.push(customTheme);
    }

    return combined;
  } catch {
    return DEFAULT_THEMES;
  }
}

export async function getThemeSettings(): Promise<PublicThemeSettings> {
  "use cache";
  cacheTag(CACHE_TAGS.theme);
  cacheLife("minutes");

  return readThemeSettingsUncached();
}

export async function readThemeSettingsUncached(): Promise<PublicThemeSettings> {
  if (!isDatabaseConfigured()) {
    return DEFAULT_THEME_SETTINGS;
  }

  try {
    const db = getDb();
    await ensureCmsTablesExist(db);
    const [row] = await db.select().from(themeSettings).where(eq(themeSettings.id, 1)).limit(1);

    if (!row) {
      return DEFAULT_THEME_SETTINGS;
    }

    return {
      activeThemeId: row.activeThemeId,
      manualOverride: row.manualOverride,
      scheduledThemeId: row.scheduledThemeId,
      scheduleStartDate: row.scheduleStartDate,
      scheduleEndDate: row.scheduleEndDate,
      returnToThemeId: row.returnToThemeId,
      updatedAt: row.updatedAt.toISOString(),
    };
  } catch {
    return DEFAULT_THEME_SETTINGS;
  }
}

export async function getActiveThemeConfig(): Promise<PublicThemeItem> {
  "use cache";
  cacheTag(CACHE_TAGS.theme);
  cacheLife("minutes");

  return readActiveThemeConfigUncached();
}

export async function readActiveThemeConfigUncached(): Promise<PublicThemeItem> {
  const [themesList, settings] = await Promise.all([
    readThemesUncached(),
    readThemeSettingsUncached(),
  ]);

  const effectiveId = resolveEffectiveThemeId(settings);
  const matched = themesList.find((t) => t.id === effectiveId);
  return matched || themesList[0] || DEFAULT_THEMES[0];
}
