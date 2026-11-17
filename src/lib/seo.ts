import type { Metadata } from "next";
import type { PublicSiteSettings } from "@/db/defaults";

export function getSiteBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

export function buildPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const baseUrl = getSiteBaseUrl();
  const canonicalUrl = `${baseUrl}${path === "/" ? "" : path}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "The Eden – Beach Homestay",
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildLodgingJsonLd(settings: PublicSiteSettings) {
  const baseUrl = getSiteBaseUrl();
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: settings.businessName,
    description:
      "Peaceful single-room beachfront homestay in Murdeshwar, Karnataka, India – 581350. Accommodates up to 4 guests with 2 main beds, 2 optional add-on beds, air conditioning, Wi-Fi, and private bathroom.",
    url: baseUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Murdeshwar",
      addressRegion: "Karnataka",
      postalCode: "581350",
      addressCountry: "IN",
    },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Beachfront access", value: true },
      { "@type": "LocationFeatureSpecification", name: "Air conditioning", value: true },
      { "@type": "LocationFeatureSpecification", name: "Wi-Fi", value: true },
      { "@type": "LocationFeatureSpecification", name: "Private bathroom", value: true },
    ],
    numberOfRooms: 1,
  };
}

