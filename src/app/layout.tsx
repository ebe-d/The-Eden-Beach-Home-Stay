import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { EnquiryProvider } from "@/components/EnquiryProvider";
import { FestivalDecorations } from "@/components/FestivalDecorations";
import { SiteShell } from "@/components/SiteShell";
import {
  getActiveThemeConfig,
  getAvailabilityBlocks,
  getSeoSettings,
  getSiteSettings,
} from "@/lib/data";
import { getSiteBaseUrl } from "@/lib/seo";
import { generateThemeCssVariables } from "@/lib/theme-utils";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const baseUrl =
    seo.canonicalUrl &&
    (seo.canonicalUrl.startsWith("http://") ||
      seo.canonicalUrl.startsWith("https://"))
      ? seo.canonicalUrl
      : getSiteBaseUrl();

  const titleDefault =
    seo.metaTitle || "The Eden – Beach Homestay | Murdeshwar, Karnataka";
  const desc =
    seo.metaDescription ||
    "Your peaceful beachfront escape in Murdeshwar, Karnataka (581350). One private beachfront room for up to 4 guests with AC, Wi-Fi, private bathroom, and coastal packages on enquiry.";
  const kw = seo.keywords
    ? seo.keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
    : [
        "The Eden Beach Homestay",
        "Murdeshwar beach homestay",
        "Murdeshwar beachfront stay",
        "Karnataka coastal homestay",
        "Murdeshwar accommodation 581350",
        "Bhatkal to Gokarna coastal stay",
      ];

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: titleDefault,
      template: `%s | ${titleDefault.split("|")[0].trim()}`,
    },
    description: desc,
    keywords: kw,
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title: seo.ogTitle || titleDefault,
      description: seo.ogDescription || desc,
      url: baseUrl,
      siteName: "The Eden Beach Home Stay",
      images: seo.ogImageUrl ? [{ url: seo.ogImageUrl }] : undefined,
      type: "website",
    },
    icons: {
      icon: [
        { url: "/brand/eden-emblem.png", type: "image/png" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      shortcut: "/brand/eden-emblem.png",
      apple: [
        { url: "/brand/eden-emblem.png", sizes: "180x180", type: "image/png" },
      ],
    },
  };
}

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('eden-theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, availabilityBlocks, activeTheme] = await Promise.all([
    getSiteSettings(),
    getAvailabilityBlocks(),
    getActiveThemeConfig(),
  ]);

  const themeCss = generateThemeCssVariables(activeTheme as any);

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      data-theme={activeTheme.id}
      suppressHydrationWarning
      className={`${jakarta.variable} ${cormorant.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <style
          id="eden-theme-vars"
          dangerouslySetInnerHTML={{ __html: themeCss }}
        />
      </head>
      <body className="min-h-screen bg-eden-bg font-sans text-eden-ink">
        <FestivalDecorations decorations={activeTheme.decorations as any} />
        <EnquiryProvider
          whatsappNumber={settings.whatsappNumber}
          bookingDisclaimer={settings.bookingDisclaimer}
          availabilityBlocks={availabilityBlocks}
        >
          <SiteShell settings={settings}>{children}</SiteShell>
        </EnquiryProvider>
      </body>
    </html>
  );
}
