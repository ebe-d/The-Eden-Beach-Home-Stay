import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export type FacilityItem = {
  id: string;
  title: string;
  description: string;
  icon: "ac" | "wifi" | "bath" | "bed" | "users" | "waves";
};

export type PackageItem = {
  id: string;
  slug: "room-only" | "breakfast-one-meal";
  title: string;
  subtitle: string;
  description: string;
  inclusions: string[];
  badge: string;
  enquiryPackageValue: "Room Only" | "Breakfast + Lunch" | "Breakfast + Dinner";
};

export const GALLERY_CATEGORIES = [
  "Bedroom",
  "Beds",
  "Bathroom",
  "Property",
  "Beachfront Views",
  "Nearby Coast",
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export const ENQUIRY_STATUSES = [
  "New",
  "Contacted",
  "Confirmed",
  "Cancelled",
] as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const PACKAGE_OPTIONS = [
  "Room Only",
  "Breakfast + Lunch",
  "Breakfast + Dinner",
] as const;

export type PackageOption = (typeof PACKAGE_OPTIONS)[number];

export const COAST_DESTINATIONS = [
  "Bhatkal",
  "Murdeshwar",
  "Honnavar",
  "Kumta",
  "Gokarna",
] as const;

export type CoastDestination = (typeof COAST_DESTINATIONS)[number];

export const AVAILABILITY_STATUSES = [
  "Unavailable",
  "Confirmed Hold",
  "Maintenance",
] as const;

export type AvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number];

export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  businessName: text("business_name").notNull(),
  whatsappNumber: text("whatsapp_number").notNull().default(""),
  contactPhone: text("contact_phone").notNull().default(""),
  contactEmail: text("contact_email").notNull().default(""),
  addressLine: text("address_line").notNull(),
  mapLinkUrl: text("map_link_url").notNull(),
  checkInNote: text("check_in_note").notNull(),
  bookingDisclaimer: text("booking_disclaimer").notNull(),
  facilitiesJson: jsonb("facilities_json").$type<FacilityItem[]>().notNull(),
  packagesJson: jsonb("packages_json").$type<PackageItem[]>().notNull(),
  beveragesNote: text("beverages_note").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  guestName: text("guest_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull().default(""),
  checkIn: text("check_in").notNull(),
  checkOut: text("check_out").notNull(),
  guests: integer("guests").notNull(),
  packageType: text("package_type").notNull(),
  addonBeds: integer("addon_beds").notNull().default(0),
  specialRequests: text("special_requests").notNull().default(""),
  status: text("status").notNull().default("New"),
  internalNotes: text("internal_notes").notNull().default(""),
  source: text("source").notNull().default("web_form"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  caption: text("caption").notNull().default(""),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  isStockPlaceholder: boolean("is_stock_placeholder").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const coastGuides = pgTable("coast_guides", {
  id: serial("id").primaryKey(),
  destination: text("destination").notNull(),
  spotName: text("spot_name").notNull(),
  shortDescription: text("short_description").notNull(),
  visitorNotes: text("visitor_notes").notNull(),
  mapUrl: text("map_url").notNull(),
  imageUrl: text("image_url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const availabilityBlocks = pgTable("availability_blocks", {
  id: serial("id").primaryKey(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  status: text("status").notNull().default("Unavailable"),
  note: text("note").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type HeroSlide = {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
};

export type ExperienceItem = {
  id: string;
  number: string;
  title: string;
  description: string;
  badge?: string;
  imageUrl?: string;
};

export type SectionVisibility = {
  hero: boolean;
  welcome: boolean;
  rooms: boolean;
  facilities: boolean;
  experiences: boolean;
  gallery: boolean;
  coast: boolean;
  enquiry: boolean;
};

export const homepageContent = pgTable("homepage_content", {
  id: integer("id").primaryKey().default(1),
  heroTitle: text("hero_title").notNull(),
  heroSubtitle: text("hero_subtitle").notNull(),
  heroImageUrl: text("hero_image_url").notNull(),
  heroSlidesJson: jsonb("hero_slides_json").$type<HeroSlide[]>().notNull().default([]),
  welcomeHeading: text("welcome_heading").notNull(),
  welcomeText: text("welcome_text").notNull(),
  welcomeImagesJson: jsonb("welcome_images_json").$type<string[]>().notNull().default([]),
  experiencesJson: jsonb("experiences_json").$type<ExperienceItem[]>().notNull().default([]),
  sectionsVisibilityJson: jsonb("sections_visibility_json").$type<SectionVisibility>().notNull(),
  isPublished: boolean("is_published").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull().default(""),
  capacityGuests: integer("capacity_guests").notNull().default(4),
  bedInfo: text("bed_info").notNull().default("2 Main Beds + 2 Optional Add-on Beds"),
  pricingNote: text("pricing_note").notNull().default("Prices provided upon enquiry"),
  imageUrl: text("image_url").notNull(),
  galleryImagesJson: jsonb("gallery_images_json").$type<string[]>().notNull().default([]),
  facilitiesJson: jsonb("facilities_json").$type<string[]>().notNull().default([]),
  isFeatured: boolean("is_featured").notNull().default(true),
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(1),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const mediaItems = pgTable("media_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  caption: text("caption").notNull().default(""),
  altText: text("alt_text").notNull().default(""),
  url: text("url").notNull(),
  storageType: text("storage_type").notNull().default("local"),
  publicId: text("public_id").notNull().default(""),
  category: text("category").notNull().default("General"),
  isFeaturedHomepage: boolean("is_featured_homepage").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  fileSize: integer("file_size").notNull().default(0),
  mimeType: text("mime_type").notNull().default("image/jpeg"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aboutContent = pgTable("about_content", {
  id: integer("id").primaryKey().default(1),
  heading: text("heading").notNull(),
  intro: text("intro").notNull(),
  fullDescription: text("full_description").notNull(),
  imagesJson: jsonb("images_json").$type<string[]>().notNull().default([]),
  highlightsJson: jsonb("highlights_json").$type<Array<{ title: string; desc: string }>>().notNull().default([]),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const seoSettings = pgTable("seo_settings", {
  id: integer("id").primaryKey().default(1),
  metaTitle: text("meta_title").notNull(),
  metaDescription: text("meta_description").notNull(),
  keywords: text("keywords").notNull().default(""),
  ogTitle: text("og_title").notNull().default(""),
  ogDescription: text("og_description").notNull().default(""),
  ogImageUrl: text("og_image_url").notNull().default(""),
  canonicalUrl: text("canonical_url").notNull().default(""),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

