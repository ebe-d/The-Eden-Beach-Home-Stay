import { Image as ImageIcon } from "lucide-react";
import { GalleryGrid } from "@/components/GalleryGrid";
import { CustomQuoteButton, WhatsappButton } from "@/components/WhatsappButton";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { getGalleryImages } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Photo Gallery — Bedroom, Beds, Bathroom & Coast in Bailur, Murudeshwar",
  description:
    "Browse editorial photography for The Eden Beach Home Stay in Bailur, Murudeshwar: beachfront views, room layout, beds, private bathroom, property atmosphere, and coastal surroundings.",
  path: "/gallery",
});

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="space-y-8">
      <ScrollReveal>
        <section className="glass-card interactive-card rounded-[32px] p-6 sm:p-10 border border-[#C5A059]/25">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#C5A059]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059]">
            <ImageIcon className="h-3.5 w-3.5" />
            Curated Visual Gallery
          </span>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-eden-ink">
            Gallery & Coastal Surroundings
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-eden-muted sm:text-base">
            Explore editorial imagery covering our private room, sleeping arrangements, en-suite
            bathroom, property mood, Tudalli Beach vistas in Bailur, and nearby Karnataka shoreline.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <WhatsappButton label="Ask for Price on WhatsApp" variant="primary" className="canva-btn-camel text-xs py-2.5 px-5 w-full sm:w-auto text-center" />
            <CustomQuoteButton label="Get a Custom Quote" className="w-full sm:w-auto text-center" />
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.08}>
        <GalleryGrid images={images} showFilters />
      </ScrollReveal>
    </div>
  );
}

