import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Bath,
  BedDouble,
  Compass,
  MapPin,
  Users,
} from "lucide-react";
import { AccommodationShowcase } from "@/components/AccommodationShowcase";
import { BookingEnquiryForm } from "@/components/BookingEnquiryForm";
import { CoastalImage } from "@/components/CoastalImage";
import { FacilityIcon } from "@/components/FacilityIcon";
import { GalleryGrid } from "@/components/GalleryGrid";
import { GuestExperiencesSection } from "@/components/GuestExperiencesSection";
import { HeroQuickEnquiryCard } from "@/components/HeroQuickEnquiryCard";
import { HomestayIntroduction } from "@/components/HomestayIntroduction";
import {
  BookYourStayButton,
  WhatsappButton,
} from "@/components/WhatsappButton";
import {
  HeroCardsEntrance,
  HeroCopyEntrance,
} from "@/components/motion/HeroEntrance";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/motion/StaggerContainer";
import { HERO_STOCK_IMAGE } from "@/db/defaults";
import { COAST_DESTINATIONS } from "@/db/schema";
import {
  getAboutContent,
  getAvailabilityBlocks,
  getCoastGuides,
  getGalleryImages,
  getHomepageContent,
  getRooms,
  getSiteSettings,
} from "@/lib/data";
import { buildLodgingJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "The Eden Beach Home Stay | Beachfront Stay in Murdeshwar",
  description:
    "Your peaceful beachfront escape in Murdeshwar, Karnataka (581350). Stay in one private beachfront room for up to 4 guests with AC, Wi-Fi, and private bathroom in Bailur, Christiankeri. Prices on enquiry.",
  path: "/",
});

export default async function HomePage() {
  const [settings, gallery, guides, availability, homepage, rooms, about] =
    await Promise.all([
      getSiteSettings(),
      getGalleryImages(),
      getCoastGuides(),
      getAvailabilityBlocks(),
      getHomepageContent(),
      getRooms(),
      getAboutContent(),
    ]);

  const jsonLd = buildLodgingJsonLd(settings);
  const primaryRoom = rooms && rooms.length > 0 ? rooms[0] : null;
  const heroBg =
    homepage?.heroImageUrl ||
    primaryRoom?.imageUrl ||
    gallery.find((g) => g.category === "Beachfront Views")?.imageUrl ||
    HERO_STOCK_IMAGE;

  return (
    <div className="space-y-16 sm:space-y-20 lg:space-y-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO SECTION: Cinematic background zoom & luxury hotel typography */}
      <section className="relative overflow-hidden rounded-[32px] border border-canva-camel/30 shadow-2xl bg-canva-forest">
        <div className="relative min-h-[580px] sm:min-h-[660px] lg:min-h-[720px]">
          {/* Zooming Coastal Background */}
          <div className="absolute inset-0 overflow-hidden">
            <CoastalImage
              src={heroBg}
              alt="Calm coastal shoreline in Murudeshwar at sunset"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center animate-hero-zoom opacity-70"
            />
          </div>

          {/* Deep Ocean Midnight + Warm Vignette Atmospheric Wash */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-canva-forest via-canva-forest/65 to-black/40"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-radial from-transparent via-canva-forest/30 to-canva-forest/85"
          />

          <div className="relative z-10 flex min-h-[580px] flex-col justify-between p-6 sm:min-h-[660px] sm:p-10 md:p-12 lg:min-h-[720px] lg:p-16">
            {/* Top Brand Tag & Editorial Serif Headline */}
            <HeroCopyEntrance className="max-w-3xl pt-2 sm:pt-4">
              <div className="inline-flex items-center gap-2.5 rounded-full bg-black/40 border border-canva-camel/30 py-1 px-3 backdrop-blur-md">
                <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full border border-canva-camel/50 bg-canva-forest">
                  <Image
                    src="/brand/eden-emblem.png"
                    alt="The Eden Emblem"
                    width={24}
                    height={24}
                    className="h-full w-full object-contain p-0.5"
                    priority
                  />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-canva-camel sm:text-xs">
                  The Eden Beach Home Stay
                </span>
                <span className="hidden text-[11px] text-[#F5F2EB]/80 sm:inline font-medium">
                  • Bailur | Murudeshwar
                </span>
              </div>

              {/* Exact Required Headline in Cormorant Garamond Serif */}
              <h1 className="mt-4 font-serif text-4xl sm:text-5xl lg:text-[4rem] font-medium leading-[1.08] tracking-tight text-white">
                {homepage?.heroTitle ||
                  "Your Peaceful Beachfront Escape in Murdeshwar."}
              </h1>

              {/* Exact Required Supporting Text */}
              <p className="mt-4 font-serif text-xl sm:text-2xl font-normal text-[#F5F2EB]/95 italic">
                {homepage?.heroSubtitle ||
                  "Stay by the sea. Slow down. Make memories."}
              </p>

              <p className="mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-[#F5F2EB]/80">
                One private beachfront room for up to 4 guests at the
                intersection of Bailur Beach Road, Christiankeri. Peaceful
                doorstep access to Tudalli Beach and just minutes from
                Murudeshwar Temple.
              </p>

              {/* Prominent Action Buttons */}
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <BookYourStayButton
                  label="Book Your Stay"
                  variant="camel"
                  showArrow
                  className="w-full sm:w-auto"
                />
                <WhatsappButton
                  label="WhatsApp Enquiry"
                  variant="secondary"
                  className="canva-btn-outline-white w-full sm:w-auto"
                  showArrow
                />
              </div>
            </HeroCopyEntrance>

            {/* Bottom Floating Glass Cards with Quick Booking Planner */}
            <HeroCardsEntrance className="mt-10 grid items-stretch gap-4 md:grid-cols-2 lg:mt-12 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-5 xl:col-span-4">
                <HeroQuickEnquiryCard previewImages={gallery} />
              </div>

              <div className="hidden lg:block lg:col-span-2 xl:col-span-4" />

              <div className="lg:col-span-5 xl:col-span-4">
                <div className="rounded-[26px] border border-white/15 bg-black/50 p-5 text-white backdrop-blur-md shadow-xl">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-canva-camel">
                        Private Beachfront Sanctuary
                      </span>
                      <h2 className="font-serif text-lg font-bold tracking-tight text-white mt-0.5">
                        {primaryRoom?.name || "The Eden Beachfront Room"}
                      </h2>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-[#F5F2EB]/75">
                        <MapPin className="h-3.5 w-3.5 text-canva-camel" />
                        <span>{settings.addressLine}</span>
                      </p>
                    </div>
                    <Link
                      href="/stay"
                      aria-label="Inspect room details"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-canva-camel text-[#070D18] font-bold shadow-sm transition-transform duration-200 hover:scale-110"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 border-y border-white/10 py-3 text-center text-xs">
                    <div>
                      <BedDouble className="mx-auto h-4 w-4 text-canva-camel" />
                      <div className="mt-1 font-bold text-white">
                        {primaryRoom?.bedInfo || "2 + 2 Beds"}
                      </div>
                      <div className="text-[10px] text-[#F5F2EB]/70">1 Room</div>
                    </div>
                    <div className="border-x border-white/10">
                      <Bath className="mx-auto h-4 w-4 text-canva-camel" />
                      <div className="mt-1 font-bold text-white">Attached</div>
                      <div className="text-[10px] text-[#F5F2EB]/70">
                        Private Bath
                      </div>
                    </div>
                    <div>
                      <Users className="mx-auto h-4 w-4 text-canva-camel" />
                      <div className="mt-1 font-bold text-white">
                        Max {primaryRoom?.capacityGuests || 4}
                      </div>
                      <div className="text-[10px] text-[#F5F2EB]/70">
                        AC & Wi-Fi
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-[#F5F2EB]/75">
                      {primaryRoom?.pricingNote || "Tariffs on enquiry"}
                    </span>
                    <Link
                      href="/stay"
                      className="font-bold uppercase tracking-wider text-canva-camel hover:underline"
                    >
                      Room Details →
                    </Link>
                  </div>
                </div>
              </div>
            </HeroCardsEntrance>
          </div>
        </div>
      </section>

      {/* 2. HOMESTAY INTRODUCTION (Matching Canva Section 1 'Timeless Suites, Delightful Stays') */}
      {homepage?.sectionsVisibility.welcome !== false && (
        <ScrollReveal>
          <HomestayIntroduction
            settings={settings}
            gallery={gallery}
            homepage={homepage}
            about={about}
          />
        </ScrollReveal>
      )}

      {/* 3. ACCOMMODATION SHOWCASE (Matching Canva Section 2, 3 & 5 Room Cards Layout) */}
      {homepage?.sectionsVisibility.rooms !== false && (
        <section className="space-y-6">
          <ScrollReveal>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-canva-camel/20 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-canva-camel block mb-1">
                  Accommodation Showcase
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-eden-ink">
                  Our Private Beachfront Sanctuary
                </h2>
              </div>
              <p className="max-w-md text-xs sm:text-sm text-eden-muted">
                One exclusive room with 2 main beds + up to 2 optional add-on
                beds, accommodating up to 4 guests by the Arabian Sea.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.06}>
            <AccommodationShowcase
              settings={settings}
              gallery={gallery}
              rooms={rooms}
            />
          </ScrollReveal>
        </section>
      )}

      {/* 4. FACILITIES & AMENITIES */}
      <section className="space-y-6">
        <ScrollReveal>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-canva-camel/20 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-canva-camel block mb-1">
                Thoughtful Amenities
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-eden-ink">
                Comforts Included With Every Stay
              </h2>
            </div>
            <Link
              href="/stay"
              className="text-xs font-bold uppercase tracking-widest text-canva-camel hover:underline inline-flex items-center gap-1.5"
            >
              <span>Full Stay Specifications</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {settings.facilities
            .filter((facility) => facility.isVisible !== false)
            .map((facility) => (
              <StaggerItem key={facility.id} className="h-full">
                <div className="glass-card interactive-card group rounded-[26px] p-6 h-full flex flex-col justify-between border border-canva-camel/15 hover:border-canva-camel/40 transition-all duration-300">
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-canva-forest text-canva-camel border border-canva-camel/25 shadow-sm transition-transform duration-300 group-hover:scale-110">
                      <FacilityIcon icon={facility.icon} />
                    </div>
                    <h3 className="mt-4 font-serif text-lg sm:text-xl font-bold text-eden-ink">
                      {facility.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-eden-muted">
                      {facility.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
        </StaggerContainer>
      </section>

      {/* 5. GUEST EXPERIENCES (Matching Canva Section 7 'Make new memories with our bespoke experiences') */}
      {homepage?.sectionsVisibility.experiences !== false && (
        <ScrollReveal>
          <GuestExperiencesSection experiences={homepage?.experiences} />
        </ScrollReveal>
      )}

      {/* 6. EDITORIAL PHOTO GALLERY PREVIEW */}
      <section className="space-y-6">
        <ScrollReveal>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-canva-camel/20 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-canva-camel block mb-1">
                Visual Journey
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-eden-ink">
                Coastal Mood & Moments
              </h2>
            </div>
            <Link
              href="/gallery"
              className="canva-btn-camel py-2.5 px-5 text-xs w-full sm:w-auto text-center"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <GalleryGrid images={gallery} showFilters={false} limit={6} />
        </ScrollReveal>
      </section>

      {/* 7. EXPLORE MURUDESHWAR & THE COAST TEASER */}
      <ScrollReveal>
        <div className="overflow-hidden rounded-[32px] border border-canva-camel/30 bg-canva-forest p-6 sm:p-10 lg:p-12 text-white shadow-2xl">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-canva-camel">
                <Compass className="h-3.5 w-3.5" />
                Regional Travel Guide
              </span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-white">
                Explore the Coast: Bailur to Gokarna
              </h2>
              <p className="mt-2 max-w-2xl text-xs sm:text-sm text-[#F5F2EB]/80 leading-relaxed">
                Use The Eden Beach Home Stay in Bailur as your tranquil coastal
                base. Explore Tudalli Beach right outside, the Murudeshwar temple
                promontory (~3.8 km north), offshore Netrani Island, backwaters,
                and scenic bays.
              </p>
            </div>
            <Link
              href="/explore-the-coast"
              className="canva-btn-camel py-3 px-6 text-xs w-full sm:w-auto text-center"
            >
              <span>Open Coastal Travel Guide</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {COAST_DESTINATIONS.map((dest) => {
              const sampleSpot = guides.find((g) => g.destination === dest);
              return (
                <Link
                  key={dest}
                  href={`/explore-the-coast#${dest.toLowerCase()}`}
                  className="group relative overflow-hidden rounded-[22px] border border-white/15 bg-black/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl last:col-span-2 sm:last:col-span-1"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <CoastalImage
                      src={sampleSpot?.imageUrl || HERO_STOCK_IMAGE}
                      alt={`${dest} coastal destination`}
                      fill
                      sizes="(max-width: 1024px) 50vw, 20vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="font-serif text-base sm:text-lg font-bold leading-tight">
                        {dest === "Murdeshwar" ? "Murudeshwar & Bailur" : dest}
                      </div>
                      {sampleSpot && (
                        <div className="truncate text-[10px] text-canva-camel font-semibold mt-0.5">
                          {sampleSpot.spotName}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      {/* 8. DIRECT BOOKING ENQUIRY SECTION */}
      <ScrollReveal className="scroll-mt-24" id="enquire">
        <div className="overflow-hidden rounded-[32px] border border-canva-camel/25 bg-white dark:bg-canva-forest p-6 sm:p-10 lg:p-14 shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-canva-camel block mb-1">
                  Reservations & Inquiries
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-eden-ink">
                  Ask for Availability & Personal Quote
                </h2>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-eden-muted">
                  Send your preferred dates, party size (1–4 guests), and chosen
                  package. There is no automated checkout or hidden charges —
                  the host connects directly with personal availability and a
                  custom quote.
                </p>

                <div className="mt-6 space-y-3 rounded-2xl bg-eden-inset p-5 text-xs text-eden-ink border border-eden-line/40">
                  <div>
                    <span className="font-bold text-canva-camel">Property: </span>
                    {settings.businessName}
                  </div>
                  <div>
                    <span className="font-bold text-canva-camel">Location: </span>
                    {settings.addressLine}
                  </div>
                  <div>
                    <span className="font-bold text-canva-camel">
                      Accommodation:{" "}
                    </span>
                    {primaryRoom?.name || "One private beachfront room"} •{" "}
                    {primaryRoom?.bedInfo ||
                      "2 main beds + up to 2 add-on beds"}{" "}
                    • Max {primaryRoom?.capacityGuests || 4} guests
                  </div>
                  <div>
                    <span className="font-bold text-canva-camel">Tariffs: </span>
                    {primaryRoom?.pricingNote || "Provided upon enquiry only"}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-eden-line/40">
                <WhatsappButton
                  label="Enquire Directly on WhatsApp"
                  variant="primary"
                  className="w-full canva-btn-camel"
                  showArrow
                />
              </div>
            </div>

            <div className="lg:col-span-7">
              <BookingEnquiryForm
                whatsappNumber={settings.whatsappNumber}
                bookingDisclaimer={settings.bookingDisclaimer}
                availabilityBlocks={availability}
              />
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
