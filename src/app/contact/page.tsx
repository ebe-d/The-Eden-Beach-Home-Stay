import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { BookingEnquiryForm } from "@/components/BookingEnquiryForm";
import { WhatsappButton } from "@/components/WhatsappButton";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { getAvailabilityBlocks, getSiteSettings } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { normalizeWhatsappNumber } from "@/lib/whatsapp";

export const metadata = buildPageMetadata({
  title: "Contact & Location — The Eden Beach Home Stay in Bailur, Murudeshwar",
  description:
    "Contact The Eden Beach Home Stay in Bailur, Murudeshwar, Karnataka, India – 581350. Intersection of Bailur Beach Road, Christiankeri. Plus Code: 4F9P+PC Bailur. Submit a stay enquiry or message on WhatsApp.",
  path: "/contact",
});

export default async function ContactPage() {
  const [settings, availability] = await Promise.all([
    getSiteSettings(),
    getAvailabilityBlocks(),
  ]);

  const hasWhatsapp = normalizeWhatsappNumber(settings.whatsappNumber).length > 0;
  const exactAddress =
    "Intersection of Bailur Beach Road, Christiankeri, Bailur, Murudeshwar, Karnataka 581350, India.";
  const plusCode = "4F9P+PC Bailur, Karnataka, India";
  const mapsLink =
    "https://www.google.com/maps/search/?api=1&query=4F9P%2BPC+Bailur+Karnataka+India";

  return (
    <div className="space-y-8">
      <ScrollReveal>
        <section className="glass-card interactive-card rounded-[32px] p-6 sm:p-10 border border-[#C5A059]/25">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#C5A059]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059]">
            Location & Enquiries
          </span>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-eden-ink">
            Contact The Eden Beach Home Stay
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-eden-muted sm:text-base">
            Reach out directly for stay availability, custom quotes for Room Only or
            Breakfast + One Meal packages, optional add-on beds, or local travel notes.
          </p>
        </section>
      </ScrollReveal>

      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        {/* Contact Details (1st on mobile, top-left on desktop) */}
        <ScrollReveal className="order-1 lg:order-none lg:col-span-5 lg:col-start-1">
          <div className="glass-card interactive-card rounded-[28px] p-5 sm:p-6 border border-[#C5A059]/20">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-eden-ink">
              Homestay Location & Contact
            </h2>

            <div className="mt-5 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#C5A059]" />
                <div>
                  <div className="font-semibold text-eden-ink">Exact Address</div>
                  <div className="text-eden-muted text-xs sm:text-sm mt-0.5">{exactAddress}</div>
                  <div className="mt-1 font-mono text-[11px] text-[#C5A059] font-semibold">
                    Plus Code: {plusCode}
                  </div>
                </div>
              </div>

              {settings.contactPhone && (
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#C5A059]" />
                  <div>
                    <div className="font-semibold text-eden-ink">Phone</div>
                    <a
                      href={`tel:${settings.contactPhone}`}
                      className="text-eden-muted hover:text-eden-ink"
                    >
                      {settings.contactPhone}
                    </a>
                  </div>
                </div>
              )}

              {settings.contactEmail && (
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#C5A059]" />
                  <div>
                    <div className="font-semibold text-eden-ink">Email</div>
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="text-eden-muted hover:text-eden-ink"
                    >
                      {settings.contactEmail}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 rounded-2xl bg-eden-inset p-4 text-xs leading-relaxed text-eden-ink border border-eden-line/40">
              <div className="font-bold text-[#C5A059]">WhatsApp Enquiry Status</div>
              <p className="mt-1 text-eden-muted">
                {hasWhatsapp
                  ? "WhatsApp enquiry chat is active — click below to start a pre-filled chat."
                  : "WhatsApp booking contact will be available soon. Please use the stay enquiry form on this page and the host will respond shortly."}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <WhatsappButton
                label="Enquire on WhatsApp"
                variant="primary"
                className="w-full sm:w-auto canva-btn-camel text-xs py-2.5 px-5"
                showArrow
              />
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="canva-btn-outline-camel w-full sm:w-auto text-center justify-center"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Booking Enquiry Form */}
        <ScrollReveal
          id="enquiry-form"
          delay={0.06}
          className="order-2 scroll-mt-24 lg:order-none lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1"
        >
          <div className="glass-card interactive-card rounded-[28px] p-5 sm:p-8 border border-[#C5A059]/20">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A059] block mb-1">
              Personalized Booking
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-eden-ink">
              Send a Stay Enquiry
            </h2>
            <p className="mt-1.5 mb-5 text-sm text-eden-muted">
              All room and package quotes are shared personally on enquiry. One private
              beachfront room • Maximum 4 guests.
            </p>

            <BookingEnquiryForm
              whatsappNumber={settings.whatsappNumber}
              bookingDisclaimer={settings.bookingDisclaimer}
              availabilityBlocks={availability}
            />
          </div>
        </ScrollReveal>

        {/* Map Card */}
        <ScrollReveal
          delay={0.12}
          className="order-3 lg:order-none lg:col-span-5 lg:col-start-1"
        >
          <div className="glass-card interactive-card overflow-hidden rounded-[28px] p-3 border border-[#C5A059]/20">
            <iframe
              title="Map of The Eden Beach Home Stay, Bailur, Murudeshwar 581350"
              src="https://maps.google.com/maps?q=4F9P%2BPC%20Bailur%20Karnataka%20India&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="h-64 w-full rounded-[20px] border-0 sm:h-72 lg:h-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

