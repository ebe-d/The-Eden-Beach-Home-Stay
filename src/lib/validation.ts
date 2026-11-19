import { z } from "zod";
import {
  AVAILABILITY_STATUSES,
  COAST_DESTINATIONS,
  ENQUIRY_STATUSES,
  GALLERY_CATEGORIES,
  PACKAGE_OPTIONS,
} from "@/db/schema";

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function getTodayIsoDate(): string {
  // Use IST (Asia/Kolkata) since the property is in Karnataka, India.
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(now);
}

export function isValidHttpOrLocalUrl(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.startsWith("/")) return !trimmed.startsWith("//");
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export const enquiryCreateSchema = z
  .object({
    guestName: z
      .string()
      .trim()
      .min(2, "Please enter your full name (at least 2 characters).")
      .max(100, "Name cannot exceed 100 characters."),
    phone: z
      .string()
      .trim()
      .refine(
        (val) => {
          const digits = val.replace(/[^\d]/g, "");
          return digits.length >= 7 && digits.length <= 15;
        },
        { message: "Please enter a valid phone number (7 to 15 digits)." }
      ),
    email: z
      .string()
      .trim()
      .max(150)
      .optional()
      .default("")
      .refine((val) => val === "" || z.string().email().safeParse(val).success, {
        message: "Please enter a valid email address or leave it blank.",
      }),
    checkIn: z.string().regex(ISO_DATE_RE, "Select a valid check-in date."),
    checkOut: z.string().regex(ISO_DATE_RE, "Select a valid check-out date."),
    guests: z.coerce
      .number()
      .int()
      .min(1, "At least 1 guest is required.")
      .max(4, "The private room accommodates a maximum of 4 guests."),
    packageType: z.enum(PACKAGE_OPTIONS, {
      message: "Please choose one of the available stay packages.",
    }),
    addonBeds: z.coerce
      .number()
      .int()
      .min(0, "Add-on beds cannot be negative.")
      .max(2, "Up to 2 optional add-on beds can be requested.")
      .default(0),
    specialRequests: z
      .string()
      .trim()
      .max(1000, "Special requests must be under 1000 characters.")
      .optional()
      .default(""),
    source: z.enum(["web_form", "whatsapp_fallback"]).optional().default("web_form"),
  })
  .superRefine((data, ctx) => {
    const today = getTodayIsoDate();
    if (data.checkIn < today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["checkIn"],
        message: "Check-in date cannot be in the past.",
      });
    }
    if (data.checkOut <= data.checkIn) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["checkOut"],
        message: "Check-out date must be after check-in date.",
      });
    }
  });

export const enquiryUpdateSchema = z.object({
  status: z.enum(ENQUIRY_STATUSES).optional(),
  internalNotes: z.string().max(3000).optional(),
});

export const facilityItemSchema = z.object({
  id: z.string().trim().min(1).max(60),
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().min(4).max(500),
  icon: z.enum([
    "ac",
    "wifi",
    "bath",
    "bed",
    "users",
    "waves",
    "beach",
    "parking",
    "car",
  ]),
  isVisible: z.boolean().default(true).optional(),
});

export const packageItemSchema = z.object({
  id: z.string().trim().min(1).max(60),
  slug: z.enum(["room-only", "breakfast-one-meal"]),
  title: z.string().trim().min(2).max(120),
  subtitle: z.string().trim().min(2).max(180),
  description: z.string().trim().min(4).max(700),
  inclusions: z.array(z.string().trim().min(2).max(200)).min(1).max(10),
  badge: z.string().trim().min(2).max(60),
  enquiryPackageValue: z.enum(PACKAGE_OPTIONS),
});

export const settingsUpdateSchema = z.object({
  businessName: z.string().trim().min(2).max(120),
  whatsappNumber: z
    .string()
    .trim()
    .max(30)
    .refine(
      (val) => {
        if (val === "") return true;
        const digits = val.replace(/[^\d]/g, "");
        return digits.length >= 8 && digits.length <= 15;
      },
      { message: "Leave WhatsApp blank or enter 8-15 digits including country code." }
    ),
  contactPhone: z.string().trim().max(30).default(""),
  contactEmail: z
    .string()
    .trim()
    .max(150)
    .refine((val) => val === "" || z.string().email().safeParse(val).success, {
      message: "Enter a valid contact email or leave blank.",
    }),
  addressLine: z.string().trim().min(4).max(300),
  mapLinkUrl: z
    .string()
    .trim()
    .refine(isValidHttpOrLocalUrl, { message: "Enter a valid map URL." }),
  checkInNote: z.string().trim().min(2).max(300),
  bookingDisclaimer: z.string().trim().min(5).max(500),
  facilities: z.array(facilityItemSchema).min(1).max(12),
  packages: z.array(packageItemSchema).min(1).max(4),
  beveragesNote: z.string().trim().min(5).max(500),
});

export const galleryImageSchema = z.object({
  title: z.string().trim().min(2).max(120),
  caption: z.string().trim().max(300).default(""),
  category: z.enum(GALLERY_CATEGORIES),
  imageUrl: z
    .string()
    .trim()
    .refine(isValidHttpOrLocalUrl, { message: "Provide a valid http(s) or local image URL." }),
  isStockPlaceholder: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
  isVisible: z.boolean().default(true),
});

export const coastGuideSchema = z.object({
  destination: z.enum(COAST_DESTINATIONS),
  spotName: z.string().trim().min(2).max(140),
  shortDescription: z.string().trim().min(5).max(600),
  visitorNotes: z.string().trim().min(5).max(600),
  mapUrl: z
    .string()
    .trim()
    .refine(isValidHttpOrLocalUrl, { message: "Provide a valid Google Maps URL." }),
  imageUrl: z
    .string()
    .trim()
    .refine(isValidHttpOrLocalUrl, { message: "Provide a valid image URL." }),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
  isVisible: z.boolean().default(true),
});

export const availabilityBlockSchema = z
  .object({
    startDate: z.string().regex(ISO_DATE_RE, "Enter valid start date (YYYY-MM-DD)."),
    endDate: z.string().regex(ISO_DATE_RE, "Enter valid end date (YYYY-MM-DD)."),
    status: z.enum(AVAILABILITY_STATUSES),
    note: z.string().trim().max(300).default(""),
  })
  .superRefine((data, ctx) => {
    if (data.endDate < data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date must be on or after start date.",
      });
    }
  });

/**
 * Checks whether a stay [checkIn, checkOut) overlaps a manual block [blockStart, blockEnd].
 * If blockEnd === blockStart, treat the block as covering that single night [blockStart, blockStart+1).
 */
export function staysOverlapBlock(
  checkIn: string,
  checkOut: string,
  blockStart: string,
  blockEnd: string
): boolean {
  const effectiveEnd = blockEnd > blockStart ? blockEnd : nextIsoDay(blockStart);
  return checkIn < effectiveEnd && checkOut > blockStart;
}

function nextIsoDay(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

const colorValueSchema = z.string().trim().min(2).max(50);

export const themeColorsSchema = z.object({
  primary: colorValueSchema,
  secondary: colorValueSchema,
  accent: colorValueSchema,
  accentHover: colorValueSchema.optional(),
  background: colorValueSchema,
  surface: colorValueSchema,
  surfaceElevated: colorValueSchema.optional(),
  text: colorValueSchema,
  mutedText: colorValueSchema,
  buttonBg: colorValueSchema.optional(),
  buttonText: colorValueSchema.default("#FFFFFF"),
  buttonHoverBg: colorValueSchema.optional(),
  borderColor: colorValueSchema,
});

export const themeTypographySchema = z.object({
  headingFont: z.enum(["cormorant", "playfair", "serif", "sans"]).default("cormorant"),
  headingLetterSpacing: z.enum(["normal", "tight", "wide"]).default("normal"),
});

export const themeButtonStyleSchema = z.object({
  buttonRadius: z.enum(["4px", "8px", "12px", "9999px"]).default("4px"),
  buttonStyle: z.enum(["solid", "elevated", "outlined"]).default("solid"),
});

export const themeDecorationsSchema = z.object({
  enabled: z.boolean().default(false),
  type: z
    .enum([
      "none",
      "diwali-diyas",
      "christmas-pine",
      "newyear-sparkles",
      "holi-colours",
      "summer-waves",
      "monsoon-raindrops",
      "winter-warmth",
    ])
    .default("none"),
  subtleBanner: z.boolean().default(false),
  festiveGreeting: z.string().trim().max(160).optional(),
});

export const themeItemSchema = z.object({
  id: z.string().trim().min(1).max(60),
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().min(4).max(500),
  category: z.enum(["preset", "festival", "season", "custom"]).default("custom"),
  colors: themeColorsSchema,
  typography: themeTypographySchema.default({
    headingFont: "cormorant",
    headingLetterSpacing: "normal",
  }),
  buttonStyle: themeButtonStyleSchema.default({
    buttonRadius: "4px",
    buttonStyle: "solid",
  }),
  decorations: themeDecorationsSchema.default({
    enabled: false,
    type: "none",
    subtleBanner: false,
  }),
  isCustom: z.boolean().default(true),
});

export const themeSettingsUpdateSchema = z.object({
  activeThemeId: z.string().trim().min(1).max(60),
  manualOverride: z.boolean().default(true),
  scheduledThemeId: z.string().trim().max(60).nullable().optional(),
  scheduleStartDate: z.string().trim().max(60).nullable().optional(),
  scheduleEndDate: z.string().trim().max(60).nullable().optional(),
  returnToThemeId: z.string().trim().min(1).max(60).default("default"),
});

