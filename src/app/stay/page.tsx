import Link from "next/link";
import { ArrowRight, BedDouble, CheckCircle2, ShieldAlert, Users } from "lucide-react";
import { AvailabilityNoticeList } from "@/components/AvailabilityNoticeList";
import { CoastalImage } from "@/components/CoastalImage";
import { FacilityIcon } from "@/components/FacilityIcon";
import { BookYourStayButton, CustomQuoteButton, WhatsappButton } from "@/components/WhatsappButton";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/StaggerContainer";
import { HERO_STOCK_IMAGE } from "@/db/defaults";
import {
  getAvailabilityBlocks,
  getGalleryImages,
  getRooms,
  getSiteSettings,
} from "@/lib/data";
import { buildLodgingJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "The Stay — One Private Beachfront Room in Bailur, Murudeshwar",
  description:
    "Stay at The Eden Beach Home Stay in Bailur, Murudeshwar (581350). One exclusive private beachfront room with 2 main beds, up to 2 optional add-on beds, maximum 4 guests, AC, Wi-Fi, and private bathroom. Doorstep access to Tudalli Beach.",
  path: "/stay",
});

export default async function StayPage() {
  const [settings, gallery, availability, rooms] = await Promise.all([
    getSiteSettings(),
    getGalleryImages(),
    getAvailabilityBlocks(),
    getRooms(),
  ]);

  const primaryRoom = rooms && rooms.length > 0 ? rooms[0] : null;
  const jsonLd = buildLodgingJsonLd(settings);
  const bedroomPhoto =
    primaryRoom?.imageUrl
      ? { imageUrl: primaryRoom.imageUrl, title: primaryRoom.name, isStockPlaceholder: false }
      : gallery.find((g) => g.category === "Beds" || g.category === "Bedroom") ||
        gallery[0];
  const bathPhoto = gallery.find((g) => g.category === "Bathroom");

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Page Hero */}
      <ScrollReveal>
        <section className="glass-card interactive-card rounded-[32px] p-6 sm:p-10 border border-[#C5A059]/25">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#C5A059]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059]">
                One Private Room Only
              </span>
              <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-eden-ink">
                {primaryRoom?.name || "Your Single Private Beachfront Sanctuary"}
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-eden-muted sm:text-base">
                {primaryRoom?.fullDescription ||
                  primaryRoom?.shortDescription ||
                  `${settings.businessName} offers one private room in Bailur, Christiankeri, Murudeshwar. Whether traveling as a couple or a small family of up to four guests, the entire beachfront guest stay is reserved exclusively for your booking with doorstep access to Tudalli Beach.`}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-2xl bg-eden-inset p-4 transition-transform duration-300 hover:scale-[1.02] border border-[#C5A059]/15">
                  <BedDouble className="mt-0.5 h-5 w-5 shrink-0 text-[#C5A059]" />
                  <div>
                    <div className="text-sm font-bold text-eden-ink">
                      {primaryRoom?.bedInfo || "2 Main Beds + 2 Optional Add-on Beds"}
                    </div>
                    <p className="mt-1 text-xs text-eden-muted">
                      Two comfortable main beds with up to two additional add-on beds
                      prepared on request.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl bg-eden-inset p-4 transition-transform duration-300 hover:scale-[1.02] border border-[#C5A059]/15">
                  <Users className="mt-0.5 h-5 w-5 shrink-0 text-[#C5A059]" />
                  <div>
                    <div className="text-sm font-bold text-eden-ink">
                      Maximum Capacity: {primaryRoom?.capacityGuests || 4} Guests
                    </div>
                    <p className="mt-1 text-xs text-eden-muted">
                      Designed to keep the room restful, uncluttered, and quiet by the sea.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <BookYourStayButton label="Book Your Stay" variant="camel" showArrow className="w-full sm:w-auto text-center" />
                <WhatsappButton label="Ask for Price on WhatsApp" variant="secondary" className="w-full sm:w-auto text-center" />
                <Link
                  href="/packages"
                  className="canva-btn-outline-camel w-full sm:w-auto text-center justify-center"
                >
                  <span>View Meal Packages</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Link>
              </div>
            </div>

            <div className="space-y-4 lg:col-span-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[26px] border border-eden-line shadow-lg group zoom-image-wrapper">
                <CoastalImage
                  src={bedroomPhoto?.imageUrl || HERO_STOCK_IMAGE}
                  alt={bedroomPhoto?.title || "Illustrative coastal bedroom preview"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover zoom-image transition-transform duration-700 ease-out group-hover:scale-108"
                />
                {bedroomPhoto?.isStockPlaceholder && (
                  <span className="absolute bottom-3 left-3 rounded-full bg-[#142033]/85 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md shadow-sm">
                    Temporary Stock Preview (Not Actual Room Photo)
                  </span>
                )}
              </div>

              {bathPhoto && (
                <div className="group flex items-center gap-4 rounded-2xl bg-eden-inset p-3.5 transition hover:bg-eden-surface">
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl zoom-image-wrapper">
                    <CoastalImage
                      src={bathPhoto.imageUrl}
                      alt={bathPhoto.title}
                      fill
                      sizes="80px"
                      className="object-cover zoom-image transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-eden-ink">Private En-suite Bathroom</div>
                    <p className="mt-0.5 text-eden-muted">
                      Dedicated private bathroom inside your stay. (Illustrative stock
                      preview shown.)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Facilities Breakdown */}
      <section>
        <ScrollReveal>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-eden-ink">
            Included Facilities & Room Specifications
          </h2>
        </ScrollReveal>
        <StaggerContainer className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {settings.facilities.map((facility) => (
            <StaggerItem key={facility.id} className="h-full">
              <div className="glass-card interactive-card group rounded-[24px] p-5 h-full">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-eden-inset text-eden-ink transition-transform duration-300 group-hover:scale-110">
                  <FacilityIcon icon={facility.icon} />
                </div>
                <h3 className="mt-3.5 text-base font-bold text-eden-ink">
                  {facility.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-eden-muted">
                  {facility.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Manual Availability & Enquiry Rules */}
      <ScrollReveal>
        <section className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-6 lg:col-span-7">
            <AvailabilityNoticeList blocks={availability} />
          </div>

          <div className="glass-card interactive-card flex flex-col justify-between rounded-[26px] p-6 md:col-span-6 lg:col-span-5">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-eden-ink">
                <ShieldAlert className="h-4 w-4 text-[#C5A059]" />
                <span>How Booking Works at The Eden</span>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-eden-muted">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#C5A059]" />
                  <span>
                    All prices (room, packages, add-on beds, and optional beverages) are
                    shared exclusively on enquiry.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#C5A059]" />
                  <span>{settings.bookingDisclaimer}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#C5A059]" />
                  <span>Check-in & house guidance: {settings.checkInNote}</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <BookYourStayButton label="Book Your Stay" variant="camel" />
              <WhatsappButton label="Enquire on WhatsApp" variant="secondary" />
              <Link
                href="/contact#enquiry-form"
                className="canva-btn-outline-camel text-xs sm:text-sm"
              >
                Open Enquiry Form
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}

