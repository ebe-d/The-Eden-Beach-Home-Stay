import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { count, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { ensureCmsTablesExist } from "@/db/auto-migrate";
import {
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_COAST_GUIDES,
  DEFAULT_GALLERY_IMAGES,
  DEFAULT_HOMEPAGE_CONTENT,
  DEFAULT_ROOMS,
  DEFAULT_SEO_SETTINGS,
  DEFAULT_SITE_SETTINGS,
} from "@/db/defaults";
import {
  aboutContent,
  coastGuides,
  galleryImages,
  homepageContent,
  rooms,
  seoSettings,
  siteSettings,
} from "@/db/schema";
import { requireAdminApi } from "@/lib/api-helpers";
import { CACHE_TAGS } from "@/lib/data";

export async function POST() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const db = getDb();
  await ensureCmsTablesExist(db);

  let insertedGallery = 0;
  let insertedGuides = 0;
  let initializedSettings = false;
  let initializedHomepage = false;
  let initializedRooms = false;
  let initializedAbout = false;
  let initializedSeo = false;

  const existingSettings = await db
    .select({ id: siteSettings.id })
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
    initializedSettings = true;
    revalidateTag(CACHE_TAGS.settings, { expire: 0 });
  }

  const existingHomepage = await db
    .select({ id: homepageContent.id })
    .from(homepageContent)
    .where(eq(homepageContent.id, 1))
    .limit(1);

  if (existingHomepage.length === 0) {
    await db.insert(homepageContent).values({
      id: 1,
      heroTitle: DEFAULT_HOMEPAGE_CONTENT.heroTitle,
      heroSubtitle: DEFAULT_HOMEPAGE_CONTENT.heroSubtitle,
      heroImageUrl: DEFAULT_HOMEPAGE_CONTENT.heroImageUrl,
      heroSlidesJson: DEFAULT_HOMEPAGE_CONTENT.heroSlides,
      welcomeHeading: DEFAULT_HOMEPAGE_CONTENT.welcomeHeading,
      welcomeText: DEFAULT_HOMEPAGE_CONTENT.welcomeText,
      welcomeImagesJson: DEFAULT_HOMEPAGE_CONTENT.welcomeImages,
      experiencesJson: DEFAULT_HOMEPAGE_CONTENT.experiences,
      sectionsVisibilityJson: DEFAULT_HOMEPAGE_CONTENT.sectionsVisibility,
      isPublished: true,
    });
    initializedHomepage = true;
    revalidateTag(CACHE_TAGS.homepage, { expire: 0 });
  }

  const [{ value: roomCount }] = await db.select({ value: count() }).from(rooms);
  if (roomCount === 0) {
    for (const r of DEFAULT_ROOMS) {
      await db.insert(rooms).values({
        name: r.name,
        slug: r.slug,
        shortDescription: r.shortDescription,
        fullDescription: r.fullDescription,
        capacityGuests: r.capacityGuests,
        bedInfo: r.bedInfo,
        pricingNote: r.pricingNote,
        imageUrl: r.imageUrl,
        galleryImagesJson: r.galleryImages,
        facilitiesJson: r.facilities,
        isFeatured: r.isFeatured,
        isVisible: r.isVisible,
        sortOrder: r.sortOrder,
      });
    }
    initializedRooms = true;
    revalidateTag(CACHE_TAGS.rooms, { expire: 0 });
  }

  const existingAbout = await db
    .select({ id: aboutContent.id })
    .from(aboutContent)
    .where(eq(aboutContent.id, 1))
    .limit(1);

  if (existingAbout.length === 0) {
    await db.insert(aboutContent).values({
      id: 1,
      heading: DEFAULT_ABOUT_CONTENT.heading,
      intro: DEFAULT_ABOUT_CONTENT.intro,
      fullDescription: DEFAULT_ABOUT_CONTENT.fullDescription,
      imagesJson: DEFAULT_ABOUT_CONTENT.images,
      highlightsJson: DEFAULT_ABOUT_CONTENT.highlights,
    });
    initializedAbout = true;
    revalidateTag(CACHE_TAGS.about, { expire: 0 });
  }

  const existingSeo = await db
    .select({ id: seoSettings.id })
    .from(seoSettings)
    .where(eq(seoSettings.id, 1))
    .limit(1);

  if (existingSeo.length === 0) {
    await db.insert(seoSettings).values({
      id: 1,
      metaTitle: DEFAULT_SEO_SETTINGS.metaTitle,
      metaDescription: DEFAULT_SEO_SETTINGS.metaDescription,
      keywords: DEFAULT_SEO_SETTINGS.keywords,
      ogTitle: DEFAULT_SEO_SETTINGS.ogTitle,
      ogDescription: DEFAULT_SEO_SETTINGS.ogDescription,
      ogImageUrl: DEFAULT_SEO_SETTINGS.ogImageUrl,
      canonicalUrl: DEFAULT_SEO_SETTINGS.canonicalUrl,
    });
    initializedSeo = true;
    revalidateTag(CACHE_TAGS.seo, { expire: 0 });
  }

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
    insertedGallery = DEFAULT_GALLERY_IMAGES.length;
    revalidateTag(CACHE_TAGS.gallery, { expire: 0 });
  }

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
    insertedGuides = DEFAULT_COAST_GUIDES.length;
    revalidateTag(CACHE_TAGS.coastGuides, { expire: 0 });
  }

  return NextResponse.json({
    initializedSettings,
    initializedHomepage,
    initializedRooms,
    initializedAbout,
    initializedSeo,
    insertedGallery,
    insertedGuides,
  });
}

