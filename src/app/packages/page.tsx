import Link from "next/link";
import { Check, Coffee, Info, Sparkles, UtensilsCrossed } from "lucide-react";
import { CustomQuoteButton, WhatsappButton } from "@/components/WhatsappButton";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { getSiteSettings } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Stay Packages — Room Only & Breakfast + One Meal in Bailur, Murudeshwar",
  description:
    "Explore stay packages at The Eden Beach Home Stay in Bailur, Murudeshwar: Room Only and Breakfast + One Meal (lunch or dinner), plus optional beverages. All tariffs provided exclusively on enquiry.",
  path: "/packages",
});

export default async function PackagesPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-10">
      <ScrollReveal>
        <section className="glass-card interactive-card rounded-[32px] p-6 sm:p-10 border border-[#C5A059]/25">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#C5A059]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#C5A059]">
            <UtensilsCrossed className="h-3.5 w-3.5" />
            All Prices on Personal Enquiry
          </span>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-eden-ink">
            Stay & Meal Packages
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-eden-muted sm:text-base">
            Keep your coastal stay simple with two straightforward packages tailored for
            our single private beachfront room in Bailur (up to 4 guests). Contact the host for
            current seasonal quotes tailored to your exact dates.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <WhatsappButton label="Enquire for Packages" variant="primary" showArrow className="canva-btn-camel text-xs py-2.5 px-5 w-full sm:w-auto text-center" />
            <CustomQuoteButton label="Get a Custom Quote" className="w-full sm:w-auto text-center" />
          </div>
        </section>
      </ScrollReveal>

      {/* Main Packages */}
      <ScrollReveal>
        <section className="grid gap-6 md:grid-cols-2">
          {settings.packages.map((pkg) => (
            <article
              key={pkg.id}
              className="glass-card interactive-card group flex flex-col justify-between rounded-[30px] p-7 sm:p-8 hover:-translate-y-1.5 transition-all duration-300 border border-[#C5A059]/20"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium text-eden-ink">{pkg.title}</h2>
                  <span className="rounded-full bg-[#C5A059] px-4 py-1 text-xs font-bold text-[#080E1A] shadow-sm">
                    {pkg.badge}
                  </span>
                </div>
                <p className="mt-1.5 text-xs font-bold uppercase tracking-wider text-[#C5A059] dark:text-[#DFBA73]">
                  {pkg.subtitle}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-eden-muted">
                  {pkg.description}
                </p>

                <div className="mt-6 rounded-2xl bg-eden-inset p-5 transition-colors group-hover:bg-eden-surface border border-eden-line/40">
                  <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-eden-ink">
                    What&apos;s Included
                  </h3>
                  <ul className="mt-3 space-y-2.5">
                    {pkg.inclusions.map((inc, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm text-eden-ink"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#C5A059]" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {pkg.slug === "breakfast-one-meal" && (
                  <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-[#C5A059]/10 p-4 text-xs text-eden-ink border border-[#C5A059]/20">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#C5A059]" />
                    <span>
                      When sending an enquiry, you can specify whether you prefer{" "}
                      <strong>Breakfast + Lunch</strong> or{" "}
                      <strong>Breakfast + Dinner</strong>.
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-7 flex flex-wrap gap-3 border-t border-eden-line pt-5">
                <WhatsappButton
                  label="Ask for Price on WhatsApp"
                  context={{ packageType: pkg.enquiryPackageValue }}
                  variant="primary"
                  className="canva-btn-camel text-xs py-2.5 px-5"
                />
                <CustomQuoteButton
                  label="Enquire for This Package"
                  context={{ packageType: pkg.enquiryPackageValue }}
                />
              </div>
            </article>
          ))}
        </section>
      </ScrollReveal>

      {/* Optional Beverages */}
      <ScrollReveal>
        <section className="glass-card interactive-card rounded-[30px] p-6 sm:p-8 border border-[#C5A059]/20">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#C5A059]/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                <Coffee className="h-3.5 w-3.5" />
                Charged Separately
              </div>
              <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-medium text-eden-ink">
                Optional Beverages
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-eden-muted">
                {settings.beveragesNote}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Tea", "Coffee", "Fresh Juices", "Soft Drinks"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-eden-line bg-eden-inset px-4 py-1.5 text-xs font-semibold text-eden-ink transition hover:border-eden-blue"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-eden-line bg-eden-inset p-5 text-xs leading-relaxed text-eden-ink sm:max-w-sm">
              <div className="flex items-center gap-2 font-bold">
                <Info className="h-4 w-4 text-eden-blue" />
                <span>Important Pricing Note</span>
              </div>
              <p className="mt-2 text-eden-muted">
                Optional beverages and add-on beds are not priced publicly on this site.
                Individual beverage rates will be provided later when your stay enquiry is
                discussed.
              </p>
              <Link
                href="/contact#enquiry-form"
                className="mt-3 inline-block font-bold text-eden-ink underline underline-offset-4 transition hover:text-eden-blue"
              >
                Send a custom package enquiry →
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}

