import { Compass } from "lucide-react";
import { CoastGuideExplorer } from "@/components/CoastGuideExplorer";
import { WhatsappButton, BookYourStayButton } from "@/components/WhatsappButton";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { getCoastGuides } from "@/lib/data";
import { buildPageMetadata, getSiteBaseUrl } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Explore the Coast — Bailur, Murudeshwar & Coastal Karnataka Travel Guide",
  description:
    "Coastal travel guide from Bhatkal to Gokarna near The Eden Beach Home Stay in Bailur, Murudeshwar: Tudalli Beach, Murudeshwar Temple & Shiva Statue, Bhukailasa Cave Museum, Statue Park, Murudeshwar Fort, Netrani Island underwater world, Kasarkod, Sharavathi backwaters, Apsarakonda, Mirjan Fort, and Gokarna beaches.",
  path: "/explore-the-coast",
});

export default async function ExploreTheCoastPage() {
  const spots = await getCoastGuides();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Coastal Travel Guide: Bhatkal to Gokarna",
    url: `${getSiteBaseUrl()}/explore-the-coast`,
    itemListElement: spots.map((spot, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "TouristAttraction",
        name: `${spot.spotName} (${spot.destination})`,
        description: spot.shortDescription,
      },
    })),
  };

  return (
    <div className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <ScrollReveal>
        <section className="rounded-[32px] bg-[#070D18] text-white p-8 sm:p-12 border border-[#C5A059]/30 shadow-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#C5A059]/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#DFBA73] border border-[#C5A059]/30">
            <Compass className="h-3.5 w-3.5 text-[#C5A059]" />
            Uttara Kannada Shoreline Guide
          </span>
          <h1 className="mt-5 font-serif text-3xl sm:text-5xl font-medium tracking-tight text-white">
            Explore the Coast: Bhatkal to Gokarna
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#F5F2EB]/80 sm:text-base">
            Use The Eden Beach Home Stay in Bailur as your serene beachfront base to explore
            doorstep Tudalli Beach, the iconic Murudeshwar temple promontory, offshore Netrani
            Island, emerald backwaters, historic laterite forts, and scenic bays stretching from
            Bhatkal north to Gokarna.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <BookYourStayButton label="Book Your Stay" variant="camel" className="w-full sm:w-auto text-center" />
            <WhatsappButton label="Enquire on WhatsApp" variant="secondary" className="w-full sm:w-auto text-center" />
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.08}>
        <CoastGuideExplorer spots={spots} />
      </ScrollReveal>
    </div>
  );
}

