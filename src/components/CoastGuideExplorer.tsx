"use client";

import { useMemo, useState } from "react";
import {
  Compass,
  ExternalLink,
  Info,
  MapPin,
  Navigation,
  Sparkles,
} from "lucide-react";
import { DEFAULT_COAST_GUIDES, type PublicCoastGuideSpot } from "@/db/defaults";
import { COAST_DESTINATIONS, type CoastDestination } from "@/db/schema";
import { CoastalImage } from "./CoastalImage";
import { HomestayLocationBanner } from "./HomestayLocationBanner";
import { NetraniIslandShowcase } from "./NetraniIslandShowcase";
import { ScrollReveal } from "./motion/ScrollReveal";

const DESTINATION_INTROS: Record<CoastDestination, string> = {
  Bhatkal:
    "Historic coastal port town south of Murdeshwar featuring serene Jaali Beach, old harbor vistas, and regional heritage spots.",
  Murdeshwar:
    "Home to The Eden Beach Home Stay in Bailur (Christiankeri). Enjoy doorstep access to serene Tudalli Beach, and take a quick 8–10 minute drive to Murudeshwar's monumental temple peninsula, Raja Gopura, Bhukailasa Cave Museum, Statue Park, and historic fort remains.",
  Honnavar:
    "Where the scenic Sharavathi river meets the Arabian Sea — Blue Flag certified Kasarkod Eco Beach, mangrove backwater boating, and Apsarakonda clifftop waterfalls.",
  Kumta:
    "Lush coastal haven celebrated for the historic 16th-century laterite Mirjan Fort and peaceful, uncrowded nearby sandy beaches.",
  Gokarna:
    "Sacred and scenic coastal peninsula famed for Om Beach, Kudle Beach, secluded Half Moon and Paradise beaches, and the revered Mahabaleshwar Temple.",
};

export function CoastGuideExplorer({
  spots,
}: {
  spots: PublicCoastGuideSpot[];
}) {
  const [activeDest, setActiveDest] = useState<"All" | CoastDestination>("All");

  const destinationsToShow = useMemo(() => {
    return activeDest === "All" ? [...COAST_DESTINATIONS] : [activeDest];
  }, [activeDest]);

  // Enrich spots with defaults in case of remote DB rows lacking extended fields
  const enrichedSpots = useMemo(() => {
    const defaultMap = new Map(
      DEFAULT_COAST_GUIDES.map((d) => [d.spotName.toLowerCase().trim(), d])
    );
    return spots.map((spot) => {
      const match = defaultMap.get(spot.spotName.toLowerCase().trim());
      return {
        ...spot,
        categoryBadge: spot.categoryBadge || match?.categoryBadge,
        interestingFacts: spot.interestingFacts || match?.interestingFacts,
        distanceFromHomestay:
          spot.distanceFromHomestay || match?.distanceFromHomestay,
        locationArea: spot.locationArea || match?.locationArea,
      };
    });
  }, [spots]);

  return (
    <div className="space-y-10">
      {/* Destination Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Filter coastal guide by town"
          className="flex flex-wrap gap-2"
        >
          {(["All", ...COAST_DESTINATIONS] as const).map((dest) => {
            const active = activeDest === dest;
            return (
              <button
                key={dest}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveDest(dest)}
                className={`cursor-pointer rounded-full px-4 py-2 text-xs font-semibold btn-interactive active:scale-95 transition-all duration-200 sm:text-sm ${
                  active
                    ? "bg-[#C5A059] text-[#080E1A] shadow-md font-bold border border-[#DFBA73]"
                    : "glass-pill text-eden-ink hover:opacity-90 hover:border-[#C5A059]"
                }`}
              >
                {dest === "All" ? "Bhatkal to Gokarna (All)" : dest}
              </button>
            );
          })}
        </div>
      </div>

      {/* Advisory Pill */}
      <div className="flex items-start gap-3 rounded-2xl border border-eden-line bg-eden-inset px-4 py-3 text-xs leading-relaxed text-eden-ink">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#C5A059]" />
        <span>
          Every destination below features a direct Google Maps button pointing to that specific attraction. Click to check live driving times, directions from your location, tides, and seasonal schedules.
        </span>
      </div>

      {/* Sections by Destination */}
      <div className="space-y-14">
        {destinationsToShow.map((destination) => {
          const destSpots = enrichedSpots.filter(
            (s) => s.destination === destination
          );
          if (destSpots.length === 0) return null;

          const isMurudeshwar = destination === "Murdeshwar";

          return (
            <section key={destination} className="space-y-8">
              {/* Destination Header */}
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#C5A059]/20 pb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                    <Compass className="h-3.5 w-3.5" />
                    Coastal Stop & Travel Guide
                  </span>
                  <h2 className="mt-1 font-serif text-3xl sm:text-4xl font-medium text-eden-ink">
                    {isMurudeshwar ? "Murudeshwar & Bailur" : destination}
                  </h2>
                </div>
                <p className="max-w-xl text-xs leading-relaxed text-eden-muted sm:text-sm">
                  {DESTINATION_INTROS[destination]}
                </p>
              </div>

              {/* Special Features for Murudeshwar Section */}
              {isMurudeshwar && (
                <div className="space-y-8">
                  {/* Homestay Location & Reference Orientation Banner */}
                  <ScrollReveal>
                    <HomestayLocationBanner />
                  </ScrollReveal>

                  {/* Dedicated Netrani Island Feature Section */}
                  <ScrollReveal delay={0.06}>
                    <NetraniIslandShowcase />
                  </ScrollReveal>

                  {/* Murudeshwar & Bailur Attractions Sub-Heading */}
                  <div className="pt-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                      Regional Sightseeing & Highlights
                    </span>
                    <h3 className="mt-1 font-serif text-2xl sm:text-3xl font-medium text-eden-ink">
                      Attractions in Bailur & Murudeshwar
                    </h3>
                    <p className="mt-1 text-xs text-eden-muted sm:text-sm">
                      Distinguishing peaceful Bailur beachfront spots right at the homestay from the historic Murudeshwar town promontory (~3.5–4 km north).
                    </p>
                  </div>
                </div>
              )}

              {/* Cards Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {destSpots.map((spot, index) => {
                  const isBailur =
                    spot.locationArea?.toLowerCase().includes("bailur") ||
                    spot.spotName.toLowerCase().includes("bailur");

                  return (
                    <ScrollReveal key={spot.id} delay={0.04 * (index % 3)}>
                      <article className="glass-card interactive-card group flex h-full flex-col overflow-hidden rounded-[28px] border border-[#C5A059]/20 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                        {/* Image Container */}
                        <div className="relative aspect-[16/10] w-full overflow-hidden zoom-image-wrapper">
                          <CoastalImage
                            src={spot.imageUrl}
                            alt={`${spot.spotName} in ${spot.destination}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover zoom-image transition-transform duration-700 ease-out group-hover:scale-108"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                          {/* Category Badge Top Left */}
                          <span className="absolute left-3.5 top-3.5 rounded-full bg-[#070D18]/90 px-3 py-1 text-[11px] font-bold text-[#F8FAFC] backdrop-blur-md shadow-sm border border-[#C5A059]/30">
                            {spot.categoryBadge || spot.destination}
                          </span>

                          {/* Location Badge Top Right */}
                          <span
                            className={`absolute right-3.5 top-3.5 rounded-full px-2.5 py-1 text-[10px] font-bold backdrop-blur-md shadow-sm ${
                              isBailur
                                ? "bg-[#0E1829] text-[#DFBA73] border border-[#C5A059]/50"
                                : "bg-black/60 text-slate-200 border border-white/20"
                            }`}
                          >
                            {isBailur ? "Bailur Beachfront" : spot.destination}
                          </span>

                          {/* Distance Pill Bottom Left */}
                          {spot.distanceFromHomestay && (
                            <span className="absolute bottom-3 left-3.5 inline-flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-0.5 text-[10px] font-semibold text-slate-200 backdrop-blur-md border border-white/10">
                              <Navigation className="h-3 w-3 text-[#C5A059]" />
                              {spot.distanceFromHomestay}
                            </span>
                          )}
                        </div>

                        {/* Card Content */}
                        <div className="flex flex-1 flex-col p-5 sm:p-6">
                          {/* Location & Title */}
                          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#C5A059]">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span>
                              {spot.locationArea || spot.destination}
                            </span>
                          </div>

                          <h3 className="mt-1.5 font-serif text-xl sm:text-2xl font-bold text-eden-ink leading-snug">
                            {spot.spotName}
                          </h3>

                          <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-eden-muted">
                            {spot.shortDescription}
                          </p>

                          {/* Interesting Facts Box (if available) */}
                          {spot.interestingFacts && (
                            <div className="mt-3.5 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/20 p-3 text-xs leading-relaxed text-eden-ink">
                              <span className="font-bold text-[#C5A059] flex items-center gap-1.5 mb-0.5 text-[11px] uppercase tracking-wide">
                                <Sparkles className="h-3 w-3 shrink-0 text-[#C5A059]" />
                                Interesting Fact
                              </span>
                              <p className="text-[11px] sm:text-xs text-eden-ink/90">
                                {spot.interestingFacts}
                              </p>
                            </div>
                          )}

                          {/* Visitor Tips Box */}
                          <div className="mt-3 rounded-2xl bg-eden-inset p-3.5 text-xs leading-relaxed text-eden-ink transition-colors group-hover:bg-eden-surface border border-eden-line/30">
                            <span className="font-bold text-[#C5A059] flex items-center gap-1.5 mb-0.5 text-[11px] uppercase tracking-wide">
                              <Info className="h-3 w-3 shrink-0" />
                              Visitor Tip
                            </span>
                            <p className="text-[11px] sm:text-xs text-eden-ink/90">
                              {spot.visitorNotes}
                            </p>
                          </div>

                          {/* Google Maps Directions Action */}
                          <div className="mt-auto pt-5">
                            <a
                              href={spot.mapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/btn btn-interactive inline-flex w-full items-center justify-center gap-2 rounded-full canva-btn-camel !py-2.5 !px-4 text-xs font-semibold shadow-sm transition-all duration-200"
                            >
                              <MapPin className="h-3.5 w-3.5 text-current transition-transform duration-200 group-hover/btn:scale-110" />
                              <span>Get Directions on Google Maps</span>
                              <ExternalLink className="h-3 w-3 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                            </a>
                          </div>
                        </div>
                      </article>
                    </ScrollReveal>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
