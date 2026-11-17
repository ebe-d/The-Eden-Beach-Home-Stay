import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { EnquiryProvider } from "@/components/EnquiryProvider";
import { SiteShell } from "@/components/SiteShell";
import { getAvailabilityBlocks, getSiteSettings } from "@/lib/data";
import { getSiteBaseUrl } from "@/lib/seo";

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

export const metadata: Metadata = {
  metadataBase: new URL(getSiteBaseUrl()),
  title: {
    default: "The Eden – Beach Homestay | Murdeshwar, Karnataka",
    template: "%s | The Eden – Beach Homestay",
  },
  description:
    "Your peaceful beachfront escape in Murdeshwar, Karnataka (581350). One private beachfront room for up to 4 guests with AC, Wi-Fi, private bathroom, and coastal packages on enquiry.",
  keywords: [
    "The Eden Beach Homestay",
    "Murdeshwar beach homestay",
    "Murdeshwar beachfront stay",
    "Karnataka coastal homestay",
    "Murdeshwar accommodation 581350",
    "Bhatkal to Gokarna coastal stay",
  ],
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

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('eden-theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, availabilityBlocks] = await Promise.all([
    getSiteSettings(),
    getAvailabilityBlocks(),
  ]);

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${jakarta.variable} ${cormorant.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-eden-bg font-sans text-eden-ink">
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
